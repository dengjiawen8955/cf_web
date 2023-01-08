<template>
    <div class="container">
        <!-- 刷新按钮 -->
        <el-button type="primary" @click="myRecords" style="margin: 2%;">刷新</el-button>
        <!-- 我的创建的捐款活动id, 我的捐款记录 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我的捐款" name="first">
                <el-table :data="myJoins" style="width: 100%">
                    <el-table-column label="捐款时间" prop="deadline" align="center" width="auto">
                        <template slot-scope="{row}">
                            <span>{{ formatTime(row.ts) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="捐款金额" prop="amount" align="center" width="auto">
                        <template slot-scope="{row}">
                            <span>{{ row.amount }} ETH</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="捐款活动id" prop="activityID" align="center" width="auto">
                        <template slot-scope="{row}">
                            <span>{{ row.activityID }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="捐款者" prop="joiner" align="center" width="auto">
                        <template slot-scope="{row}">
                            <span>{{ row.joiner }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="comment" align="center" width="auto">
                        <template slot-scope="{row}">
                            <span>{{ row.comment }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="我的创建" name="second">
                <el-table :data="myActivityIDs" style="width: 100%">
                    <el-table-column label="捐款活动id" prop="activityID" align="center" width="auto">
                        <template slot-scope="{row}">
                            <span>{{ row }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

export default {
    name: 'Mine',
    mounted() {
        // 如果钱包没有数据, 弹出提示去连接钱包, 点击确定跳转到钱包页面
        if (this.$root.WALLET === null || this.$root.WALLET === undefined) {
            this.$confirm('请先连接钱包', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push({ path: '/wallet' })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
            
        }
        console.log("balance: ", this.$root.WALLET.balance)
        this.myRecords()
    },
    data() {
        return {
            activeName: 'first',
            myJoins: [
                {
                    id: 1,
                    activityID: 1,
                    joiner: '0x1234567890',
                    ts: 1234567890,
                    amount: 100,
                    comment: 'test'
                }
            ],
            myActivityIDs: [1, 2, 3],
            wallet: this.$root.WALLET
        }
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        },
        formatTime(ts) {
            return new Date(ts * 1000).toLocaleString({ hour12: false })
        },
        myRecords() {
            // 查询个人的捐款记录和参与的众筹活动
            // 合约接口: function myRecords() external view returns (JoinRecord[] memory, uint[] memory);
            this.wallet.cf3.methods.myRecords().call().then((res) => {
                console.log("myRecords: ", res)
                this.myJoins = res[0]
                this.myActivityIDs = res[1]
            })  
        }
    }
}

</script>

<style scoped>

</style>
