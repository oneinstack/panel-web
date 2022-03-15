<template>
  <div class="app-container">
    <div class="filter-container">
     <el-button
        type="primary"
        size="default"
        @click="createFormVisible = true"
      >{{ $t('table.create') }}</el-button> 
    </div>
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
        width="80"
        prop="id">
      </el-table-column>

      <el-table-column
        :label="$t('table.group')"
        align="center"
        width="100px"
        prop="group">
      </el-table-column>

      <el-table-column
        :label="$t('table.name')"
        align="center"
        width="100px"
        prop="name">
      </el-table-column>

      <el-table-column
        :label="$t('table.dev_by')"
        align="center"
        prop="dev_by">
      </el-table-column>

      <el-table-column
        :label="$t('table.ops_by')"
        align="center"
        prop="ops_by">
      </el-table-column>

      <el-table-column
        :label="$t('table.language')"
        align="center"
        width="80px"
        prop="language">
      </el-table-column>

      <!-- <el-table-column
        :label="$t('table.status')"
        align="center"
        width="100px"
        >
        <template #default="{row}">
          <span v-if="row.status">启用</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column> -->

      <el-table-column
        :label="$t('table.status')"
        width="100"
        prop="status"
        sortable
        align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="true"
            :inactive-value="false"
            disabled
            @change="handleStatus(scope.row.id)"
          />
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.comment')"
        align="center"
        width="220px"
        prop="comment">
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>

          <el-popconfirm
            confirm-button-text="Yes"
            cancel-button-text="No"
            icon-color="red"
            :title="$t('table.deleteHandle')"
            @confirm="handleDelete(row)"
            @cancel="cancelEvent"
            >
            <template #reference>
              <el-button
              size="small"
              type="danger"
              >{{ $t('table.delete') }}</el-button>
            </template>
          </el-popconfirm>
          <el-button
            v-if="row.status"
            type="success"
            size="default"
            @click="handleConsole(row)"
          >
            {{ $t('table.console') }}
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

    <create-projects
      :visible="createFormVisible"
      :on-cancel="() => setCreateFormVisible(false)" 
      :on-submit-loading="createSubmitLoading" 
      :on-submit="createSubmit"
    /> 

    <update-projects
      v-if="updateFormVisible===true"
      :visible="updateFormVisible"
      :values="updateData"
      :on-cancel="() => setUpdateFormVisible(false)" 
      :on-submit-loading="updateSubmitLoading" 
      :on-submit="updateSubmit"
      /> 
  </div>
</template>

<script>
import {
 projectsListReq,
 projectsCreateReq,
 projectsUpdateReq,
 projectsDeleteBatchReq
} from '@/api/projects'

import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination/index.vue'
import { useI18n } from 'vue-i18n'
import { reactive, ref, toRefs, computed, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import createProjects from './components/createProjects.vue'
import updateProjects from './components/updateProjects.vue'

export default {
  name: 'Project',
  components: {Pagination,createProjects,updateProjects, },
  directives: { waves },
  setup() {
    const { t } = useI18n();
    const router = useRouter()
    const listLoading = ref(false);
    const createFormVisible = ref(false);
    const updateFormVisible = ref(false);
    const createSubmitLoading = ref(false);
    const updateSubmitLoading = ref(false);
    const totalPage = ref(0);
    const updateData = ref({});
    const tableData = ref();
    const pagination = reactive({
      page: 1,
      per_page: 10,
    })

    const getList = async (current) => {
      listLoading.value = true
      pagination.page = current.page
      pagination.per_page = current.limit || pagination.per_page
      await projectsListReq(pagination).then(response => {
        tableData.value = response.data;
        totalPage.value = Number(response.headers['total-pages'])
      })
      listLoading.value = false
    }

    const handleUpdate = (row) => {
      updateData.value = row
      updateFormVisible.value = true;
    }

   const handleDelete = async (val) => {
      await projectsDeleteBatchReq(val.id).then(response => {
        if (response.status == 204) {
          ElMessage.success('删除成功!');
          getList(1)
          }
        }).catch( error => {
          console.log('error', error)
          ElMessage.error('删除失败！');
        })      
    }

    const cancelEvent = () => {
      console.log('cancel!')
    }

    const setCreateFormVisible = (val) => {
          createFormVisible.value = val;
    };

    const handleStatus = (id) => {
      console.log(id,'sss')
    }
   
    const setUpdateFormVisible = (val) => {
        updateFormVisible.value = val ;
    }

    const createSubmit = (values, resetFields) => {
        createSubmitLoading.value = true;
        projectsCreateReq(values).then(response => {
          ElMessage.success('新增成功！');
          getList(1)
        }).catch(error => {
            console.log('error', error)
            ElMessage({
              type: "error",
              message: '新增失败！',
              grouping: true,
              duration: 5000
            })
        })
        resetFields();
        setCreateFormVisible(false);
        createSubmitLoading.value = false;
    }

     const updateSubmit = async (values, resetFields) => {
     updateSubmitLoading.value = true ;
     await projectsUpdateReq(values.id, values).then(response => {
        ElMessage.success('更新成功！');
        getList(1)
     }).catch(error => {
        console.log('error', error)
        ElMessage.error('更新失败！');
      })
      resetFields();
      setUpdateFormVisible(false);
      updateSubmitLoading.value = false;
   }

   const handleConsole = (row) => {
     router.push({
       path: '/projects/projectDetail',
       name: 'projectDetail',
       params: {
         id: row.id
       }
     })
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
      handleUpdate,
      handleDelete,
      handleConsole,
      handleStatus,
      cancelEvent,
      keyData: tableData,
      createFormVisible,
      updateFormVisible,
      setCreateFormVisible,
      setUpdateFormVisible,
      createSubmitLoading,
      updateSubmitLoading,
      createSubmit,
      updateSubmit,
      updateData,
      
    }
  }
}
</script>