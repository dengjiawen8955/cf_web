<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 连接MetaMask按钮 -->
    <el-button type="primary" @click="connectMetaMask">连接MetaMask</el-button>
    <!-- 已经连接的展示信息 -->
    <div v-if="isConnect" class="dashboard-text">
      <div>address: {{ user.address }}</div>
      <div>balance: {{ user.balance }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Web3 from 'web3'

export default {
  name: 'Dashboard',

  data() {
    return {
      web3: null,
      user: {
        address: '',
        balance: 0
      },
      isConnect: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // 连接MetaMask, 并将储存地址
    connectMetaMask() {
      console.log('连接MetaMask')
      // 请先安装MetaMask
      if (typeof window.ethereum === 'undefined' && typeof window.web3 === 'undefined') {
        alert('请先安装MetaMask')
        return
      }

      // 连接MetaMask
      this.web3 = new Web3(window.ethereum)
      window.ethereum.enable().then((accounts) => {
        this.user.address = accounts[0]
        this.isConnect = true
        this.getBalance()
        // 提示连接成功
        alert('连接成功')
      })
    },
    // 获取余额
    getBalance() {
      this.web3.eth.getBalance(this.user.address, (err, balance) => {
        if (err) {
          alert(err)
          return
        }
        this.user.balance = this.web3.utils.fromWei(balance, 'ether')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
