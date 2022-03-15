<template>
  <div class="app-container">
    <div class="filter-container">
     <el-button
        type="primary"
        size="default"
        @click="createFormVisible = true"
      >{{ $t('table.create') }}
     </el-button> 
    </div>

    <el-table
      v-loading="listLoading"
      border
      stripe
      highlight-current-row
      :data="tableData"
      style="width: 100%;margin-top: 20px;  max-height: 400px; overflow: auto;"
    > 
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        :label="$t('table.id')"
        align="center"
        width="80"
        prop="id">
      </el-table-column>

      <el-table-column
        :label="$t('table.group')"
        align="center"
        prop="group">
      </el-table-column>

      <el-table-column
        :label="$t('table.project')"
        align="center"
        prop="project">
      </el-table-column>

      <el-table-column
        :label="$t('table.env')"
        align="center"
        width="80"
        prop="env">
      </el-table-column>

      <el-table-column
        :label="$t('table.key')"
        align="center"
        prop="key">
      </el-table-column>

      <el-table-column
        :label="$t('table.value')"
        align="center"
        prop="value">
      </el-table-column>

      <el-table-column
        :label="$t('table.value_type')"
        align="center"
        prop="value_type">
      </el-table-column>
     
      <el-table-column
        :label="$t('table.remark')"
        align="center"
        prop="remark">
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
         
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="Math.ceil(totalPage / pagination.per_page) > 1"
      background
      :page="pagination.page"
      :limit="pagination.per_page"
      :total="totalPage"
      @pagination="(p) => {onRefresh(p || 1)}"
    />
    <create-config-projects
      v-if="createFormVisible===true"
      :select-data="dataList"
      :env="env"
      :envs="envs"
      :projects="projects"
      :visible="createFormVisible"
      :on-cancel="() => setCreateFormVisible(false)" 
      :on-submit-loading="createSubmitLoading" 
      :on-submit="createSubmit"
    /> 

    <update-config-projects
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
 projectsConfigListReq,
 projectsConfigCreateReq,
 projectsConfigUpdateReq,
 projectsConfigDeleteBatchReq
} from '@/api/configProjects'


import {
  keyListReq
} from '@/api/key'


import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import { useI18n } from 'vue-i18n'
import { reactive, ref, toRefs, computed, onMounted, watch, onUpdated } from 'vue'
import { ElMessage } from "element-plus";
import { Calendar, Search } from '@element-plus/icons-vue'
import createConfigProjects from './createConfigProjects.vue'
import updateConfigProjects from './updateConfigProjects.vue'

export default {
  name: 'ConfigProjects',
  components: {Pagination,createConfigProjects,updateConfigProjects, },
  directives: { waves },
  props: {
    env: {
      type: String,
      required: true
    },
    envs: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    totalPage: {
      type: Number,
      required: false
    },
    onRefresh: {
      type: Function,
      required: true
    },
    projects: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();
    const listLoading = ref(false);
    const createFormVisible = ref(false);
    const updateFormVisible = ref(false);
    const createSubmitLoading = ref(false);
    const updateSubmitLoading = ref(false);
    const contentSearch = ref();
    const updateData = ref({});
    const pagination = reactive({
      page: 1,
      per_page: 10,
      env: props.env
    })

  
    const handleUpdate = (row) => {
      updateData.value = row
      updateFormVisible.value = true;
    }

   const handleDelete = async (val) => {
      await projectsConfigDeleteBatchReq(val.id).then(response => {
        if (response.status == 204) {
          ElMessage.success('删除成功!');
          props.onRefresh(pagination);
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
   
    const setUpdateFormVisible = (val) => {
        updateFormVisible.value = val ;
    }

    const createSubmit = (values, resetFields) => {
        createSubmitLoading.value = true;
        projectsConfigCreateReq(values).then(response => {
          ElMessage.success('新增成功！');
          props.onRefresh(pagination);
        }).catch(error => {
            console.log('error', error)
            ElMessage.error('新增失败！');
        })
        resetFields();
        setCreateFormVisible(false);
        createSubmitLoading.value = false;
    }

     const updateSubmit = async (value, resetFields) => {
     updateSubmitLoading.value = true ;
     await projectsConfigUpdateReq(value.id, value).then(response => {
        ElMessage.success('更新成功！');
        props.onRefresh(pagination);
     }).catch(error => {
        console.log('error', error)
        ElMessage.error('更新失败！');
      })
      resetFields();
      setUpdateFormVisible(false);
      updateSubmitLoading.value = false;
    }

     const tmpPagination = {
        project_filter: true,
        project_id: props.projects.id,
        env: props.env
      }

    
      const dataList = ref([])

      const getAllforKey = () => {
        keyListReq(tmpPagination).then(response => {
          dataList.value = response.data
        })
      }

      onMounted(() => {
        getAllforKey()
      })
     

    return {
      t,
      listLoading,
      pagination,
      handleUpdate,
      handleDelete,
      cancelEvent,
      dataList,
      createFormVisible,
      updateFormVisible,
      setCreateFormVisible,
      setUpdateFormVisible,
      createSubmitLoading,
      updateSubmitLoading,
      createSubmit,
      updateSubmit,
      updateData,
      contentSearch,
    }
  },
}
</script>

<style scoped>
  .filter-container {
    display: contents;
  }

</style>