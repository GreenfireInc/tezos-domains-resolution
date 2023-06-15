<template>
  <div id="app">
    <input v-model="domain" />
    <button @click="resolveAddress">Resolve</button>
    <p v-if="!loading && address !== ''">Domain resolves to: {{ address }}</p>
    <p v-else-if="!loading && address === ''">Enter a domain.</p>
    <p v-else>...</p>
  </div>
</template>

<script>
import { TezosToolkit } from '@taquito/taquito'
import { TaquitoTezosDomainsClient } from '@tezos-domains/taquito-client'
import { Tzip16Module } from '@taquito/tzip16'

export default {
  name: 'App',  
  data: () => ({
    address: '',
    client: null,
    domain: '',
    loading: false
  }),
  mounted () {
    },
  methods: {
    async resolveAddress () {
      const tezos = new TezosToolkit('https://mainnet.api.tez.ie')
      tezos.addExtension(new Tzip16Module())
      const client = new TaquitoTezosDomainsClient({ tezos, network: 'mainnet', caching: { enabled: true }})
      this.client = client
      this.loading = true
      const domain = this.domain
      try {
        const address = await this.client.resolver.resolveNameToAddress(domain)
        this.address = address ? address : 'null'
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  },
}
</script>
