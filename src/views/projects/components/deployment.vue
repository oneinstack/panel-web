<template>
  <div class="app-container">
      <el-table
        v-loading="listLoading"
        border
        stripe
        highlight-current-row
        :data="keyData"
        style="width: 100%;margin-top: 20px;  max-height: 400px; overflow: auto;"
      > 
      <el-table-column
        :label="$t('table.id')"
        align="center"
        width="50"
        prop="id">
      </el-table-column>

      <el-table-column
        :label="$t('table.group')"
        align="center"
        width="90px"
        prop="group">
      </el-table-column>

      <el-table-column
        :label="$t('table.project')"
        align="center"
        width="100px"
        prop="project">
      </el-table-column>

      <el-table-column
        :label="$t('table.env')"
        align="center"
        width="90px"
        prop="env">
      </el-table-column>
     
      <el-table-column
        :label="$t('table.build_url')"
        align="center"
        prop="build_url">
      </el-table-column>

      <el-table-column
        :label="$t('table.address')"
        align="center"
        prop="address">
      </el-table-column>
      
      <el-table-column
        :label="$t('table.tag')"
        align="center"
        width="100px"
        prop="tag">
      </el-table-column>

      <el-table-column
        :label="$t('table.action')"
        align="center"
        width="100px"
        prop="action">
      </el-table-column>

      <el-table-column
        :label="$t('table.created_by')"
        align="center"
        width="100px"
        prop="created_by">
      </el-table-column>

      <el-table-column
        :label="$t('table.created_at')"
        align="center"
        width="150px"
        prop="created_at">
      </el-table-column>

      <el-table-column
        :label="$t('table.duration')"
        align="center"
        width="100px"
        prop="duration">
        <template #default="{row}">
            <span>{{ row.duration / 1000  }}秒</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        align="center"
        width="120px"
        prop="status">
        <template #default="{row}">
            <span v-if="row.status === 'succeed'">
              <el-icon class='is-success' :size='18'><check /></el-icon>
            </span>
            <span v-if="row.status === 'failed'">
              <el-icon class="is-failed" :size='18'><close /></el-icon>
            </span>
            <span v-if="row.status === 'ongoing'">
              <el-icon class="is-loading" :size='18'><loading /></el-icon>
            </span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="logDetail(row)"
          >
            {{ $t('table.logDetail') }}
          </el-button>
        </template>
      </el-table-column>
      
    </el-table>
    <pagination
      v-if="Math.ceil(totalPage / pagination.per_page) > 1"
      background
      :page="pagination.page"
      :limit="pagination.per_page"
      :total="totalPage"
      @pagination="(p) => {getList(p || 1)}"
    />
  </div>
</template>

<script>
import {
 deployListReq,
 deployCreateReq,
 deployUpdateReq,
 deployDeleteBatchReq
} from '@/api/deployment'
import { Loading, Check, Close } from '@element-plus/icons'

import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination/index.vue' 
import { useI18n } from 'vue-i18n'
import { reactive, ref, toRefs, computed, onMounted, watch, onBeforeMount } from 'vue'
import { ElMessage } from "element-plus";

export default {
  name: 'Deployment',
  components: {Pagination, Loading, Check, Close},
  directives: { waves },
  props: {
    projects: {
      type: Object,
      required: true  
    },
    env: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    const listLoading = ref(false);
    const totalPage = ref(0);
    const updateData = ref({});
    const tableData = ref();
    const pagination = reactive({
      page: 1,
      per_page: 10,
      group: props.projects.group,
      project: props.projects.name
    })
    const getList = async (current) => {
      listLoading.value = true
      if (pagination.group) {
        pagination.page = current.page
        pagination.per_page = current.limit || pagination.per_page
        deployListReq(pagination).then(response => {
          tableData.value = response.data;
          totalPage.value = Number(response.headers['total-pages'])
        })
      }
      listLoading.value = false
    }

    watch(() => props.projects,(newVal, oldVal) => {
      pagination['group'] = newVal.group,
      pagination['project'] = newVal.name
      getList(1)
    })

    const logDetail = () => {
      console.log('logDetail')
    }
   
    onMounted(() => {
      getList(1)
    })

   
    return {
      t,
      listLoading,
      pagination,
      totalPage,
      getList,
      keyData: tableData,
      updateData,
      logDetail
    }
  },
}
</script>