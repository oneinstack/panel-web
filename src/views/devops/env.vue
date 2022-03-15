<template>
  <div class="app-container">
    <div class="filter-container">
       <el-button
        type="primary"
        size="default"
        @click="createFormVisible = true"
      >{{ $t('table.create') }}</el-button> 

       <el-button
        type="primary"
        size="default"
        @click="searchFormVisible = true"
      >{{ $t('table.search') }}</el-button> 

    </div>
 
    <el-table
      v-loading="listLoading"
      stripe
      :data="keyData"
      border
      highlight-current-row
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
        prop="id">
      </el-table-column>

      <el-table-column
        :label="$t('table.name')"
        align="center"
        prop="name">
      </el-table-column>

     

      <el-table-column
        :label="$t('table.remark')"
        align="center"
        prop="remark">
      </el-table-column>>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="250"
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
      :page="pagination.page"
      :limit="pagination.per_page"
      :total="totalPage"
      @pagination="(p) => {getList(p || 1)}"
    />

     <create-config-env
      :visible="createFormVisible"
      :on-cancel="() => setCreateFormVisible(false)" 
      :on-submit-loading="createSubmitLoading" 
      :on-submit="createSubmit"
    />
    <update-config-env
      v-if="updateFormVisible===true"
      :visible="updateFormVisible"
      :values="updateData"
      :on-cancel="() => setUpdateFormVisible(false)" 
      :on-submit-loading="updateSubmitLoading" 
      :on-submit="updateSubmit"
      /> 

      <search-config-env
      v-if="searchFormVisible === true"
      :visible="searchFormVisible"
      :on-cancel="() => setSearchFormVisible(false)" 
      :on-submit-loading="searchSubmitLoading" 
      :on-submit="searchSubmit"
      >
      </search-config-env>
  </div>
</template>

<script>
import {
  envsGetReq,
  envCreateReq,
  envUpdateReq,
  envDeleteBatchReq
} from '@/api/env'

import { Search } from '@element-plus/icons'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import { useI18n } from 'vue-i18n'
import { ElMessage } from "element-plus";

import { computed, reactive } from 'vue'

import CreateConfigEnv from './components/createConfigEnv.vue';
import UpdateConfigEnv from './components/updateConfigEnv.vue';
import SearchConfigEnv from './components/searchConfigEnv.vue';


export default {
  name: 'Env',
  components: {Pagination,CreateConfigEnv,UpdateConfigEnv, SearchConfigEnv},
  directives: { waves },
  setup() {
    const { t } = useI18n();
    const listLoading = ref(false);
    const createFormVisible = ref(false);
    const updateFormVisible = ref(false);
    const searchFormVisible = ref(false);
    const createSubmitLoading = ref(false);
    const updateSubmitLoading = ref(false);
    const searchSubmitLoading = ref(false);
    const tableData = ref();
    const totalPage = ref(0);
    const updateData = ref({});
    const pagination = reactive({
      page: 1,
      per_page: 10,
    })


    const getList = async (current) => {
      listLoading.value = true
      pagination.page = current.page
      pagination.per_page = current.limit || pagination.per_page
      await envsGetReq(pagination).then(response => {
        tableData.value = response.data;
        totalPage.value = Number(response.headers['total-pages'])
      })
      listLoading.value = false
    }

    const handleFilter = () => {
      console.log('handleFilter')
    }

    const handleUpdate = (row) => {
      updateData.value = row
      updateFormVisible.value = true;
    }


     const handleDelete = async (val) => {
      await envDeleteBatchReq(val.id).then(response => {
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

    const setUpdateFormVisible = (val) => {
        updateFormVisible.value = val ;
    }

    const setSearchFormVisible = (val) => {
        searchFormVisible.value = val ;
    }
   
   const updateSubmit = async (value, resetFields) => {
     updateSubmitLoading.value = true ;
     await envUpdateReq(value.id, value).then(response => {
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

    const searchSubmit = async (value, resetFields) => {
      let searchEnvs = {
        name: value.name,
        remark: value.remark
      }
      searchSubmitLoading.value = true ;
      await envsGetReq(searchEnvs).then(response => {
        tableData.value = response.data;
        totalPage.value = Number(response.headers['total-pages'])
      })
      resetFields();
      setSearchFormVisible(false);
      searchSubmitLoading.value = false;
    }

    const createSubmit = (values, resetFields) => {
        createSubmitLoading.value = true;
        envCreateReq(values).then(response => {
          ElMessage.success('新增成功！');
          getList(1)
        }).catch(error => {
            console.log('error', error)
            ElMessage.error('新增失败！');
        })
        resetFields();
        setCreateFormVisible(false);
        createSubmitLoading.value = false;
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
      handleFilter,
      handleDelete,
      handleUpdate,
      cancelEvent,
      keyData: tableData,
      createFormVisible,
      updateFormVisible,
      searchFormVisible,
      setCreateFormVisible,
      setSearchFormVisible,
      setUpdateFormVisible,
      createSubmitLoading,
      updateSubmitLoading,
      searchSubmitLoading,
      createSubmit,
      updateSubmit,
      searchSubmit,
      updateData,
    }
  }
}
</script>