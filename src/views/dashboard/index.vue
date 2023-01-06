<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <!-- 连接MetaMask按钮 -->
    <el-button type="primary" @click="connectMetaMask">连接MetaMask</el-button>
    <!-- 调用合约方法 -->
    <el-button type="primary" @click="callHelloContract">调用Hello合约方法</el-button>
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
      helloContractAddress: '0x883564980cDaB2bef5BebD54e98F1B2873bAFC9d',
      singleCrowdFundingContractAddress: '0x363c5Eb107dd2009058d62bc27bef776209216E5',
      helloContractABIString: `[
        {
          "inputs": [],
          "name": "Hello",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        }
      ]`,
      isConnect: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    callHelloContract() {
      // 调用 Hello.sol 的 HelloContract 的 hello() 方法 返回一条 memory string, 将其展示在页面上\
      const helloContractABI = JSON.parse(this.helloContractABIString)
      const helloContract = new this.web3.eth.Contract(
        helloContractABI,
        this.helloContractAddress,
        {
          from: this.user.address,
          gasPrice: '20000000000'
        })
      helloContract.methods.Hello().call().then((res) => {
        alert(res)
      })
    },
    // 连接MetaMask, 并将储存地址
    connectMetaMask() {
      // MetaMask检查
      if (typeof window.ethereum === 'undefined' && typeof window.web3 === 'undefined') {
        this.isConnect = false
        // 弹出dialog, 提示用户安装MetaMask
        this.$confirm('请先安装MetaMask', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 打开MetaMask的下载页面
          window.open('https://metamask.io/download.html', '_blank')
        }).catch(() => {
          // 取消安装
        })
        return
      }

      // 连接MetaMask
      window.ethereum.enable().then((accounts) => {
        this.web3 = new Web3(window.ethereum)
        this.user.address = accounts[0]
        this.isConnect = true
        this.getBalance()
        console.log(this.web3)
        alert('连接成功')
      }).catch((err) => {
        console.error(err)
        alert('连接失败')
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
