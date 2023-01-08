<template>
    <div class="container">
        <!-- 连接钱包按钮 -->
        <el-button type="primary" @click="connectWallet" style="margin: 2%;">连接钱包</el-button>
        <!-- 展示信息 -->
        <div v-if="wallet.isConnect">
            <p>钱包地址: {{ wallet.address }}</p>
            <p>钱包余额: {{ wallet.balance }} ETH</p>
        </div>
    </div>
</template>

<script>
// 导入web3
import Web3 from 'web3'
// 导入 truffle-contract

export default {
    name: 'Wallet',
    data() {
        return {
            wallet: {
                cf3: null,
                cf3Address: '0x9144dD5f50Cb44AecD056e5586Ec4a597Aea8610',
                address: '',
                balance: 0,
                web3: null,
                isConnect: false
            },
        }
    },
    methods: {
        // 连接钱包: 连接钱包, 初始化合约, 获取用户余额
        connectWallet() {
            // MetaMask检查
            if (typeof window.ethereum === 'undefined' && typeof window.web3 === 'undefined') {
                this.wallet.isConnect = false
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
                this.wallet.web3 = new Web3(window.ethereum)
                this.wallet.address = accounts[0]
                this.wallet.isConnect = true
                console.log(this.wallet.web3)
                // 初始化合约
                this.initContract()
                // 获取余额
                this.getBalance()
                // 设置全局变量
                this.$root.WALLET = this.wallet
            }).catch((err) => {
                console.error(err)
                alert('连接失败')
            })
            alert('连接成功')
        },
        initContract() {
            // 通过 truffle-contract, cf3Abi.json, 和 合约地址, 新建合约实例
            let cf3Abi = require('@/contracts/cf3Abi.json')
            let cf3 = new this.wallet.web3.eth.Contract(cf3Abi, this.wallet.cf3Address)

            // 访问变量 address public author; 测试合约是否连接成功
            cf3.methods.author().call().then((author) => {
                if (author == null || author == '') {
                    this.$message({
                        message: '合约连接失败',
                        type: 'error'
                    })
                    return
                }
                this.$message({
                    message: '合约连接成功',
                    type: 'success'
                })
                console.log(author)
            })

            this.wallet.cf3 = cf3
        },
        // 获取余额
        getBalance() {
            this.wallet.web3.eth.getBalance(this.wallet.address, (err, balance) => {
                if (err) {
                    alert(err)
                    return
                }
                this.wallet.balance = this.wallet.web3.utils.fromWei(balance, 'ether')
            })
        }
    }
}

</script>

<style scoped>

</style>
