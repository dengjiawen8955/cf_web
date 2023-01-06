<template>
  <div class="content">
    <!-- 连接MetaMask -->
    <button @click="connectMetaMask">连接MetaMask</button>
    <h3> 新书众筹</h3>
    <span>以最低的价格获取我的新书 </span>

    <div class="status">
      <div v-if="!closed">已众筹资金：<b>{{ total }} ETH </b></div>
      <div v-if="closed"> 众筹已完成 </div>
      <div>众筹截止时间：{{ endDate }}</div>
    </div>

    <div v-if="joined" class="card-bkg">
      <div class="award-des">
        <span> 参与价格 </span>
        <b> {{ joinPrice }} ETH </b>
      </div>

      <button :disabled="closed" @click="withdraw">赎回</button>
    </div>

    <div v-if="!joined" class="card-bkg">
      <div class="award-des">
        <span> 当前众筹价格 </span>
        <b> {{ price }} ETH </b>
      </div>

      <button :disabled="closed" @click="join">参与众筹</button>
    </div>

    <div v-if="isAuthor">
      <button :disabled="closed" @click="withdrawFund"> 提取资金</button>
    </div>

  </div>
</template>

<script>
import Web3 from 'web3'
import contract from 'truffle-contract'
import crowd from '@/contracts/SingleCrowdfunding.json'

export default {

  name: 'CrowdFund',
  // 定义上面HTML模板中使用的变量
  data() {
    return {
      crowdFund: null,
      price: null,
      total: 0,
      closed: true,
      joinPrice: null,
      joined: false,
      endDate: '',
      isAuthor: true
    }
  },
  methods: {
    connectMetaMask() {
    //  初始化 web3及账号
    this.initWeb3Account()
    //  初始化合约实例
    this.initContract()
    //  获取合约的状态信息
    this.getCrowdInfo()
  },
    join() {
      this.web3.eth.sendTransaction({
        from: this.account,
        to: this.crowdFund.address,
        value: this.web3.utils.toWei(this.price)
      }).then(() =>
        this.getCrowdInfo()
      )
    },
    withdraw() {
      this.crowdFund.withdraw({
        from: this.account
      }).then(() => {
        this.getCrowdInfo()
      })
    },
    withdrawFund() {
      this.crowdFund.withdrawFund({
        from: this.account
      }).then(() => {
        this.getCrowdInfo()
      })
    },
    initWeb3Account() {
      if (window.ethereum) {
        this.provider = window.ethereum
        try {
          window.ethereum.enable()
        } catch (error) {
          //   console.log("User denied account access")
        }
      } else if (window.web3) {
        this.provider = window.web3.currentProvider
      } else {
        this.provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
      }
      this.web3 = new Web3(this.provider)
      this.web3.eth.getAccounts().then(accs => {
        this.account = accs[0]
      })
    },
    initContract() {
      const crowdContract = contract(crowd)
      crowdContract.setProvider(this.provider)
      this.crowdFund = crowdContract.deployed()
    },
    getCrowdInfo() {
      // 获取合约的余额
      this.web3.eth.getBalance(this.crowdFund.address).then(
        r => {
          this.total = this.web3.utils.fromWei(r)
        }
      )

      // 获取读者的参与金额
      this.crowdFund.joined(this.account).then(
        r => {
          if (r > 0) {
            this.joined = true
            this.joinPrice = this.web3.utils.fromWei(r)
          }
        }
      )

      // 获取合约的关闭状态
      this.crowdFund.closed().then(
        r => this.closed = r
      )

      // 获取当前的众筹价格
      this.crowdFund.price().then(
        r => this.price = this.web3.utils.fromWei(r)
      )

      // 获取众筹截止时间
      this.crowdFund.endTime().then(r => {
        var endTime = new Date(r * 1000)
        // 把时间戳转化为本地时间
        this.endDate = endTime.toLocaleDateString().replace(/\//g, '-') + ' ' + endTime.toTimeString().substr(0, 8)
      })

      // 获取众筹创作者地址
      this.crowdFund.author().then(r => {
        if (this.account == r) {
          this.isAuthor = true
        } else {
          this.isAuthor = false
        }
      })
    }

  }
}
</script>
