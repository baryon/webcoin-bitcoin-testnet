'use strict'

const magic = 0x0709110b
const defaultPort = 18333

const dnsSeeds = ['testnet-seed.bitcoin.petertodd.org', 'testnet-seed.bluematt.me', 'testnet-seed.bitcoin.schildbach.de']
const webSeeds = ['wss://us-west.seed.webcoin.io:8193', 'wss://us-east.seed.webcoin.io:8193', 'wss://eu.seed.webcoin.io:8193', 'wss://asia.seed.webcoin.io:8193'
// TODO: add more
]

module.exports = {
  magic: magic,
  defaultPort: defaultPort,
  dnsSeeds: dnsSeeds,
  webSeeds: webSeeds
}
