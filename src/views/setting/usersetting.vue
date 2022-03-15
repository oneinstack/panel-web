<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        :placeholder="$t('table.username')"
        clearable
        prefix-icon="el-icon-search"
        style="width: 180px;"
        @keyup.enter="handleFilter"
        @clear="handleFilter"
      />

      <el-select
        v-model="listQuery.status"
        :placeholder="$t('table.status')"
        clearable
        style="width: 90px; padding: 10px 10px 10px 10px;"
        class="filter-item"
        @change="handleFilter">
      
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select> 
      <el-button
        v-waves
        type="primary"
        @click="handleFilter"
      >{{ $t('table.search') }}
      </el-button>
      <!--
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}
      </el-button>
      -->
    </div>
 
    <el-table
      v-loading="listLoading"
      stripe
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <!-- <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template v-slot="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>-->
      <el-table-column
        :label="$t('table.username')"
        align="center"
        prop="username">
      </el-table-column>

      <el-table-column
        :label="$t('table.email')"
        align="center"
        prop="email">
      </el-table-column>

      <el-table-column
        :label="$t('table.phone')"
        align="center"
        prop="phone">
      </el-table-column>

      <el-table-column
        :label="$t('table.role')"
        align="center"
        prop="roles">
        
        <template #default="scope">
          <span>{{ roleFilter(scope.row.roles) }} </span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.comment')"
        align="center"
        prop="comment">
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        prop="status"
        sortable
        align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatus($event, scope.row.id)"
          />
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template #default="{ row }">
          <el-button
            size="mini"
            type="success"
            @click="handleDetail(row)"
          >
            {{ $t('table.detail') }}
          </el-button>

          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="small"
            type="danger"
            @click="handleDelete(row)"
          >{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.pagesize"
      :total="total"
      @pagination="getList"
    />

    <el-dialog
      v-model:visible="dialogFormVisible"
      :title="textMap[dialogStatus]"
    >
      <el-form
        ref="dataForm"
        :element-loading-text="$t('table.loading')"
        element-loading-background="rgba(255,255,255,0.7)"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="88px"
        style="width: 380px; margin-left:50px;"
      >
        <el-form-item
          :label="$t('table.username')"
          prop="username"
        >
          <el-input
            v-model="temp.username"
            :disabled="dialogStatus === 'create' ? false : true"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus != 'detail' ? true : false"
          :label="$t('table.password')"
          prop="password"
        >
          <el-input
            v-model="temp.password"
            placeholder="6 - 20"
          />
        </el-form-item>

        <el-form-item
          :label="$t('table.phone')"
          prop="phone"
        >
          <el-input
            v-model="temp.phone"
            :disabled="dialogStatus === 'detail' ? true : false"
          />
        </el-form-item>

        <el-form-item
          :label="$t('table.email')"
          prop="email"
        >
          <el-input
            v-model="temp.email"
            :disabled="dialogStatus === 'detail' ? true : false"
          />
        </el-form-item>

        <el-form-item
          :label="$t('table.role')"
          prop="role"
        >
          <el-select
            v-model="temp.role"
            :disabled="dialogStatus === 'detail' ? true : false"
            class="filter-item"
            placeholder
          >
            <el-option
              v-for="item in userTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="dialogStatus == 'create' ? false : true"
          :label="$t('table.status')"
        >
          <el-switch
            v-model="temp.status"
            :disabled="dialogStatus === 'detail' ? true : false"
            :active-value="1"
            :inactive-value="2"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus == 'detail' ? true : false"
          :label="$t('table.created_by')"
          prop="created_by"
        >
          <el-input
            v-model="temp.created_by"
            :disabled="dialogStatus === 'detail' ? true : false"
          />
        </el-form-item>

        <el-form-item
          v-if="dialogStatus == 'detail' ? true : false"
          :label="$t('table.created_at')"
          prop="created_at"
        >
          <el-input
            v-model="temp.created_at"
            :disabled="dialogStatus === 'detail' ? true : false"
          />
        </el-form-item>

        <el-form-item :label="$t('table.comment')">
          <el-input
            v-model="temp.comment"
            :disabled="dialogStatus === 'detail' ? true : false"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">{{
          $t('table.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-model:visible="dialogPvVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pv"
          label="Pv"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >{{
          $t('table.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  userListReq,
  userCreateReq,
  userUpdateReq,
  userDeleteReq,
  userUpdateStatusBatchReq
} from '@/api/user'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import { useI18n } from 'vue-i18n'

import { computed, reactive } from 'vue'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  setup() {
    const { t } = useI18n();
    const tableData = reactive([]);
    const calendarTypeOptions = [
      { key: 'CN', display_name: 'China' },
      { key: 'US', display_name: 'USA' }
    ]

    const statusOptions = [
      { key: true, display_name: t('table.enable') },
      { key: false, display_name: t('table.disable') }
    ]

    const userTypeOptions = [
      { key: "readonly", display_name: t('table.readonly') },
      { key: "editor", display_name: t('table.editor') },
      { key: "admin", display_name: t('table.admin') }
    ]

    // arr to obj, such as { CN : "China", US : "USA" }
    const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
      acc[cur.key] = cur.display_name
      return acc
    }, {})

    return {
      t,
      calendarTypeKeyValue,
      userTypeOptions,
      statusOptions,
      calendarTypeOptions,
      tableData,
    }
  },
  data() {
    return {
      multipleSelection: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pagesize: 20,
        username: undefined,
        status: undefined
      },
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' },
        { label: 'status Ascending', key: '+status' },
        { label: 'status Descending', key: '-status' }
      ],
      showReviewer: false,
      temp: {
        id: undefined,
        username: '',
        password: '',
        phone: '',
        email: '',
        role: '',
        status: undefined,
        comment: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        reload: this.$t('table.reload'),
        update: this.$t('table.edit'),
        create: this.$t('table.add'),
        detail: this.$t('table.detail')
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        role: [{ required: true, message: 'role is required' }],
        username: [
          { required: true, min: 4, max: 20, trigger: 'blur' }
        ],
        email: [
          { type: 'email', trigger: ['blur', 'change'] }
        ],
        password: [
          { min: 6, max: 20 }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    roleFilter() {
      const userTypeMap = {
        "readonly": this.$t('table.readonly'),
        "editor": this.$t('table.editor'),
        "admin": this.$t('table.admin')
      }
      return (roleList) => { return roleList.map((u)=> {return userTypeMap[u]})}
    },
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      userListReq(this.listQuery).then(response => {
        this.tableData = response.data
        // this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: this.$t('table.updated_successfully'),
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        username: '',
        password: '',
        phone: '',
        email: '',
        comment: '',
        role: 1,
        status: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          userCreateReq(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('table.success'),
              message: this.$t('table.created_successfully'),
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDetail(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'detail'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          userUpdateReq(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('table.success'),
              message: this.$t('table.updated_successfully'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      const data = {
        id: row.id
      }
      userDeleteReq(data).then(() => {
        this.$notify({
          title: this.$t('table.success'),
          message: this.$t('table.deleted_successfully'),
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleBan() {
      if (this.multipleSelection.length > 0) {
        const ids = this.multipleSelection.map(val => val.id)
        const data = {
          ids: ids,
          status: 2
        }
        userUpdateStatusBatchReq(data).then(() => {
          this.getList()
          this.$notify({
            title: this.$t('table.success'),
            message: this.$t('table.disabled_successfully'),
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    handleStatus(status, id) {
      const data = {
        ids: [id],
        status: status
      }
      const setMessage =
        status === 1
          ? this.$t('table.enabled_successfully')
          : this.$t('table.disabled_successfully')
      // userUpdateReqStatusBatchReq(data).then(() => {
      //   this.getList()
      //   this.$notify({
      //     title: this.$t('table.success'),
      //     message: setMessage,
      //     type: 'success',
      //     duration: 2000
      //   })
      // })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>

<style scoped>
</style>