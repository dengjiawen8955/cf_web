<template>
    <div class="container">
        <!-- 发起募捐活动按钮 -->
        <el-button type="success" @click="isCreateActivity = true" style="margin: 1%; ">发起募捐活动</el-button>

        <!-- 输入id搜索 -->
        <el-input v-model="searchIDs" placeholder="输入id搜索多个id用逗号,隔开" style="margin: 1%; width: 20%;"></el-input>
        <el-button type="primary" @click="getListByIDs()">搜索</el-button>

        <!-- 发起募捐活动对话框 -->
        <el-dialog title="发起募捐活动" :visible.sync="isCreateActivity" width="30%">
            <el-form label-width="80px">
                <el-form-item label="活动信息">
                    <el-input v-model="activityData"></el-input>
                </el-form-item>
                <el-form-item label="目标金额">
                    <el-input v-model="targetMoney"></el-input>
                </el-form-item>
                <el-form-item label="活动天数">
                    <el-input v-model="activityDays"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isCreateActivity = false">取 消</el-button>
                <el-button type="primary" @click="createActivity">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 募捐活动列表 -->
        <!-- 表格内容: id, 标题,  当前金额, 目标金额, 截止时间时间, 状态, 操作(查看)-->
        <el-table :data="getActivitiesRet" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="ID" prop="id" align="center" width="auto">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="标题" prop="title" align="center" width="auto">
                <template slot-scope="{row}">
                    <span>{{ getTitle(row.data) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="当前金额" prop="currentMoney" align="center" width="auto">
                <template slot-scope="{row}">
                    <span>{{ row.currentMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column label="目标金额" prop="targetMoney" align="center" width="auto">
                <template slot-scope="{row}">
                    <span>{{ row.targetMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column label="截止时间" prop="deadline" align="center" width="auto">
                <template slot-scope="{row}">
                    <span>{{ formatTime(row.endTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" align="center" width="auto">
                <template slot-scope="{row}">
                    <span>{{ getStatus(row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="auto">
                <template slot-scope="{row}">
                    <el-button type="text" @click="viewActivity(row.id, row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="tableData.total > 0" :total="tableData.total" :page.sync="tableData.page"
            :limit.sync="tableData.limit" @pagination="getList" />

        <!-- 募捐活动详情对话框 -->
        <!-- id, 标题, 当前金额, 目标金额, 截止时间时间, 状态, 受益人address, 捐赠记录,  捐赠金额(输入框), 捐赠按钮-->
        <!-- 作者提取资金按钮 -->
        <el-dialog title="募捐活动详情" :visible.sync="isViewActivity" width="30%">
            <el-form label-width="80px">
                <el-form-item label="ID">
                    {{ activity.id }}
                </el-form-item>
                <el-form-item label="标题">
                    {{ getTitle(activity.data) }}
                </el-form-item>
                <el-form-item label="当前金额">
                    {{ activity.currentMoney }}
                </el-form-item>
                <el-form-item label="目标金额">
                    {{ activity.targetMoney }}
                </el-form-item>
                <el-form-item label="截止时间">
                    {{ formatTime(activity.endTime) }}
                </el-form-item>
                <el-form-item label="状态">
                    {{ getStatus(activity) }}
                </el-form-item>
                <el-form-item label="受益人">
                    {{ activity.beneficiary }}
                </el-form-item>

                <!-- 捐赠记录 joinRecords: id, activityID, joiner, tsStr, amount, comment -->
                <el-form-item label="捐赠记录">
                    <el-table :data="activity.joinRecords" border fit highlight-current-row height="250"
                        style="width: 100%;">
                        <el-table-column label="ID" prop="id" align="center" width="auto">
                            <template slot-scope="{row}">
                                <span>{{ row.id }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="活动ID" prop="activityID" align="center" width="auto">
                            <template slot-scope="{row}">
                                <span>{{ row.activityID }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="捐赠人" prop="joiner" align="center" width="auto">
                            <template slot-scope="{row}">
                                <span>{{ row.joiner }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="捐赠时间" prop="ts" align="center" width="auto">
                            <template slot-scope="{row}">
                                <span>{{ formatTime(row.ts) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="捐赠金额" prop="amount" align="center" width="auto">
                            <template slot-scope="{row}">
                                <span>{{ row.amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="comment" align="center" width="auto">
                            <template slot-scope="{row}">
                                <span>{{ row.comment }}</span>
                            </template>
                        </el-table-column>
                        <!-- 退回按钮 -->
                        <el-table-column label="操作" fixed="right" width="auto">
                            <template slot-scope="{row}">
                                <el-button type="text" @click="handleReaderWithdraw(row)">退回</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>


                <el-form-item label="捐赠金额">
                    <el-input v-model="donationAmount"></el-input>
                </el-form-item>

                <el-form-item label="捐赠备注">
                    <el-input v-model="donationComment"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isViewActivity = false">取 消</el-button>
                <el-button type="primary" @click="handleDonation">捐 赠</el-button>
                <el-button type="primary" @click="isScanCode = true">扫码捐赠</el-button>
                <!-- 仅仅在可以提取的时候展示: 作者提取按钮-->
                <el-button v-if="isAbleAuthorWithdraw(activity)" type="success" @click="handleAuthorWithdraw(activity)">提 取</el-button>
            </span>
        </el-dialog>

        <!-- 扫码捐赠的二维码 -->
        <el-dialog title="扫码捐赠" :visible.sync="isScanCode" width="30%">
            <!-- 标题 -->
            <div style="text-align: center;">
                <span>标题: {{ getTitle(activity.data) }}</span>
            </div>
            <!-- 提示 -->
            <br>
            <div style="text-align: center;">
                <span>请使用钱包扫描二维码进行捐赠</span>
            </div>
            <br>
            <div style="text-align: center;">
                <vue-qr :logoSrc="imageUrl" :text="scanCodeUrl" :size="400"></vue-qr>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="isScanCode = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
import vueQr from 'vue-qr'


export default {
    name: 'crowdfunding',
    components: { Pagination, vueQr },
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
            return
        }
        console.log("balance: ", this.$root.WALLET.balance)
        this.getTotal()
    },
    computed: {
        // 以太坊扫码付款地址
        scanCodeUrl() {
            return `ethereum:${this.wallet.address}?value=${this.donationAmount}`
        }
    },
    data() {
        return {
            imageUrl: require('@/assets/logo.png'),
            isScanCode: false,
            searchIDs: '',
            getActivitiesRet: [
                {
                    id: 1,
                    beneficiary: '0x1234567890',
                    data: 'Demo数据请点击搜索刷新',
                    targetMoney: 1000,
                    currentMoney: 100,
                    endTime: 1577836800,
                    closed: false,
                    joinRecordID: 1,
                    joinRecords: [
                        {
                            id: 1,
                            activityID: 1,
                            joiner: '0x1234567890',
                            ts: 1577836800,
                            amount: 100,
                            comment: 'comment',
                        }
                    ]
                },
            ],
            isViewActivity: false,
            donationAmount: 0,
            donationComment: '',
            activity: {}, // 募捐活动详情
            tableData: {
                tableKey: 0,
                listLoading: true,
                page: 1,
                limit: 10,
                total: 100,
            },
            activityData: '活动1',
            activityDays: 1,
            targetMoney: 100,
            wallet: this.$root.WALLET,
            isCreateActivity: false
        }
    },
    methods: {
        handleReaderWithdraw(row) {
            console.log("handleReaderWithdraw")
            let recordID = row.id
            let activityID = row.activityID
            // 调用合约的 withdraw
            this.wallet.cf3.methods.readerWithdraw(activityID, recordID).send({ from: this.wallet.address }).then((ret) => {
                console.log("withdraw ret: ", ret)
                this.$message({
                    type: 'success',
                    message: '退款成功'
                });
            }).catch((err) => {
                console.log("withdraw err: ", err)
                this.$message({
                    type: 'error',
                    message: '退款失败' 
                });
            })
        },
        handleAuthorWithdraw(row) {
            console.log("handleAuthorWithdraw")
            // 调用合约的 withdraw
            this.wallet.cf3.methods.authorWithdraw(row.id).send({ from: this.wallet.address }).then((ret) => {
                console.log("withdraw ret: ", ret)
                this.$message({
                    type: 'success',
                    message: '提取成功'
                });
            }).catch((err) => {
                console.log("withdraw err: ", err)
                this.$message({
                    type: 'error',
                    message: '提取失败' 
                });
            })
        },
        // 作者是否可以提现
        isAbleAuthorWithdraw(row) {
            console.log("isAbleAuthorWithdraw")
            return true
            // 只有活动结束, 且活动金额达到目标金额, 且 !row.closed
            // return row.endTime < (Date.now() / 1000) && row.currentMoney >= row.targetMoney && !row.closed
        },
        getListByIDs() {        
            console.log("getListByIDs")
            // 将 searchIDs 转换为数组
            let ids = this.searchIDs.split(',')
            // 字符串转数字
            ids = ids.map(id => parseInt(id))
            // 调用合约的 getActivitiesByIDs
            if (ids.length === 0 || this.searchIDs === '') {
                this.getList()
            } else {
                this.getActivities(ids)
            }
        },
        formatTime(ts) {
            return new Date(ts * 1000).toLocaleString({ hour12: false })
        },
        getTitle(dataStr) {
            return dataStr
        },
        getStatus(row) {
            // 时间没到: 进行中
            // 时间到了, 金额没到: 募捐失败
            // 时间到了, 金额到了: 待收款
            // 时间到了, 金额到了, 已经收款: 已完成
            if (row.endTime > Date.now() / 1000) {
                return '进行中'
            } else if (row.endTime <= Date.now() / 1000 && row.currentMoney < row.targetMoney) {
                return '募捐失败'
            } else if (row.endTime <= Date.now() / 1000 && row.currentMoney >= row.targetMoney && row.closed === false) {
                return '待收款'
            } else if (row.endTime <= Date.now() / 1000 && row.currentMoney >= row.targetMoney && row.closed === true) {
                return '已完成'
            }

            return '未知'
        },
        handleDonation() {
            console.log("handleDonation")
            if (this.donationAmount <= 0) {
                this.$message({
                    type: 'error',
                    message: '捐赠金额必须大于0'
                });
                return
            }
            // 合约: function join(uint id, string memory comment) external payable;
            // 调用 join 合约支付 donationAmount wei, 传入 donationComment
            this.wallet.cf3.methods.readerJoin(this.activity.id, this.donationComment).send({
                from: this.wallet.address,
                value: this.donationAmount
            }).then((ret) => {
                console.log("join ret: ", ret)
                this.$message({
                    type: 'success',
                    message: '捐赠成功'
                });
                this.isViewActivity = false
                this.getList()
            }).catch((err) => {
                console.log("join err: ", err)
                this.$message({
                    type: 'error',
                    message: '捐赠失败'
                });
            })

        },
        // 查看募捐活动详情
        viewActivity(id, row) {
            this.isViewActivity = true
            this.activity = row
            console.log("viewActivity: ", id, row)
        },
        // 调用
        getList() {
            console.log("getList")
            // 获取 [start, start + 1 ... end]
            let start = (this.tableData.page - 1) * this.tableData.limit + 1
            let end = start + this.tableData.limit - 1
            if (end > this.tableData.total) {
                end = this.tableData.total
            }
            let arr = []
            for (let i = start; i <= end; i++) {
                arr.push(i)
            }
            this.getActivities(arr)
        },
        getTotal() {
            console.log("getTotal")
            this.wallet.cf3.methods.activityID().call().then((res) => {
                console.log("getTotal: ", res)
                // string to int
                res = parseInt(res)
                this.tableData.total = res
            })
        },
        // 批量查询募捐详情
        // solidity 方法: function getActivities(uint[] memory ids) external view returns (Activity[] memory);
        getActivities(arr) {
            console.log("arr: ", arr)
            try {
                this.wallet.cf3.methods.getActivities(arr).call().then((res) => {
                    console.log("getActivities: ", res)
                    // 过滤出 id = 0 的活动
                    res = res.filter(item => item.id != 0)
                    this.getActivitiesRet = res
                })
            } catch (e) {
                console.log("getActivities error: ", e)
                this.$message({
                    type: 'error',
                    message: '查询募捐活动失败'
                });
            }
        },
        // 发起募捐活动
        createActivity() {
            this.isCreateActivity = false
            console.log(this.activityData, this.targetMoney, this.deadline)
            if (this.activityData == '') {
                this.$message({
                    type: 'error',
                    message: '请输入活动标题'
                });
                return
            }
            if (this.targetMoney <= 0) {
                this.$message({
                    type: 'error',
                    message: '目标金额必须大于0'
                });
                return
            }
            if (this.activityDays <= 0) {
                this.$message({
                    type: 'error',
                    message: '活动天数必须大于0'
                });
                return
            }

            this.wallet.cf3.methods.createActivity(this.targetMoney, this.activityDays, this.activityData).send({
                from: this.wallet.address,
            }).then((ret) => {
                console.log("createActivity ret: ", ret)
                this.$message({
                    type: 'success',
                    message: '发起募捐活动成功'
                });
                this.getList()
            }).catch((err) => {
                console.log("createActivity err: ", err)
                this.$message({
                    type: 'error',
                    message: '发起募捐活动失败'
                });
            })
        }
    }
}

</script>