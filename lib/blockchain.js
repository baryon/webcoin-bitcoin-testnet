'use strict'

// blockchain definition

const bitcoin = require('webcoin-bitcoin').blockchain
const u = require('bitcoin-util')

const genesisHeader = {
  height: 0,
  version: 1,
  prevHash: u.nullHash,
  merkleRoot: u.toHash('4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b'),
  timestamp: 1296688602,
  bits: 0x1d00ffff,
  nonce: 414098458
}

const checkpoints = [{
  version: 1073676288,
  prevHash: Buffer.from('c28aaf47e2574db86bc2daf2a10e38d52f738ad02f00f203e900000000000000', 'hex'),
  merkleRoot: Buffer.from('bea48abbc1ab99fd497c24209730aac7db267e4f2d6cb1977656c91da2b7d282', 'hex'),
  timestamp: 1549280514,
  bits: 436283074,
  nonce: 3607464172,
  height: 1455552
}]

const minDiffStart = 1329264000

function shouldRetarget (block, cb) {
  const onInterval = block.height % this.interval === 0
  const afterTimeoutStart = block.header.timestamp >= minDiffStart
  return cb(null, onInterval || afterTimeoutStart)
}

function calculateTarget (block, chain, cb) {
  const _this = this

  if (block.height % this.interval === 0) {
    return bitcoin.calculateTarget.call(this, block, chain, cb)
  }

  chain.getBlock(block.header.prevHash, function (err, prev) {
    if (err) return cb(err)

    const timeDelta = block.header.timestamp - prev.header.timestamp
    if (timeDelta > _this.targetSpacing * 2) {
      // the network didn't find a block in time, so lower difficulty to minimum
      return cb(null, chain.maxTarget())
    }

    // the difficulty is whatever is in the last non-mindiff block
    traverseToRealDifficulty.call(_this, block, chain, function (err, prev) {
      if (err) return cb(err)
      cb(null, u.expandTarget(prev.header.bits))
    })
  })
}

// traverse to last real difficulty block (not a mindiff timeout blocks)
function traverseToRealDifficulty (block, chain, cb) {
  const _this2 = this

  const traverse = function traverse (err, prev) {
    if (err) return cb(err)
    const onInterval = prev.height % _this2.interval === 0
    if (onInterval || prev.header.bits !== _this2.genesisHeader.bits) {
      return cb(null, prev)
    }
    chain.getBlock(prev.header.prevHash, traverse)
  }
  chain.getBlock(block.header.prevHash, traverse)
}

module.exports = {
  genesisHeader: genesisHeader,
  checkpoints: checkpoints,
  shouldRetarget: shouldRetarget,
  calculateTarget: calculateTarget,
  traverseToRealDifficulty: traverseToRealDifficulty
}
