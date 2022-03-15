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
      :data="keyData.data"
      border
      highlight-current-row
      style="width: 100%; margin-top: 20px;  max-height: 400px; overflow: auto;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
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
        :label="$t('table.key')"
        align="center"
        prop="key">
      </el-table-column>

      <el-table-column
        :label="$t('table.remark')"
        align="center"
        prop="remark">
      </el-table-column>

      
      <el-table-column
        :label="$t('table.value_type')"
        align="center"
        width="80"
        prop="value_type">
      </el-table-column>

      <el-table-column
        :label="$t('table.value')"
        align="center"
        prop="value">
      </el-table-column>

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
      background
      :page="pagination.page"
      :limit="pagination.per_page"
      :total="totalPage"
      @pagination="(p) => {getList(p || 1)}"
    />
    <create-config-global
      :select-data="dataList"
      :visible="createFormVisible"
      :on-cancel="() => setCreateFormVisible(false)" 
      :on-submit-loading="createSubmitLoading" 
      :on-submit="createSubmit"
    /> 

    <update-config-global
      v-if="updateFormVisible===true"
      :visible="updateFormVisible"
      :values="updateData"
      :on-cancel="() => setUpdateFormVisible(false)" 
      :on-submit-loading="updateSubmitLoading" 
      :on-submit="updateSubmit"
      />

    <search-config-gloabl
      v-if="searchFormVisible===true"
      :visible="searchFormVisible"
      :on-cancel="() => setSearchFormVisible(false)" 
      :on-submit-loading="searchSubmitLoading" 
      :on-submit="searchSubmit"
      />
  </div>
</template>

<script>
import {
 globalListReq,
 globalCreateReq,
 globalUpdateReq,
 globalDeleteBatchReq
} from '@/api/global'

import {
  keyListReq
} from '@/api/key'

import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination/index.vue' 
import { useI18n } from 'vue-i18n'
import { reactive, ref, toRefs, computed, onMounted } from 'vue'
import { ElMessage } from "element-plus";
import CreateConfigGlobal from './components/createConfigGlobal.vue';
import UpdateConfigGlobal from './components/updateConfigGlobal.vue'
import SearchConfigGloabl from './components/searchConfigGlobal.vue'
 

export default {
  name: 'Global',
  components: { Pagination,CreateConfigGlobal,UpdateConfigGlobal,SearchConfigGloabl},
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
    const totalPage = ref(0);
    const updateData = ref({});
    const tableData = reactive({
      data: []
    });
    const pagination = reactive({
      page: 1,
      per_page: 10,
    })

    const getList = (current) => {
      pagination.page = current.page
      pagination.per_page = current.limit || pagination.per_page
      globalListReq(pagination).then(response => {
        tableData.data = response.data;
        totalPage.value = Number(response.headers['total-pages'])
      })
    }

    const handleFilter = () => {
      console.log('handleFilter')
    }


    const handleUpdate = (row) => {
      updateData.value = row
      updateFormVisible.value = true;
    }

    const handleDelete = async (val) => {
      await globalDeleteBatchReq(val.id).then(response => {
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
   
    const setSearchFormVisible = (val) => {
      searchFormVisible.value = val;
    }

    const searchSubmit = async (value, resetFields) => {
      let searchGlobal = {
        key: value.key,
        value: value.value
      }
      searchSubmitLoading.value = true ;
      await globalListReq(searchGlobal).then(response => {
        tableData.data = response.data;
        totalPage.value = Number(response.headers['total-pages'])
      })
      resetFields();
      setSearchFormVisible(false);
      searchSubmitLoading.value = false;

    }

    const createSubmit = (values, resetFields) => {
        createSubmitLoading.value = true;
        globalCreateReq(values).then(response => {
          ElMessage.success('新增成功！');
          getList(1)
        }).catch(error => {
            console.log('error', error)
            ElMessage.success('新增失败！');
        })
        resetFields();
        setCreateFormVisible(false);
        createSubmitLoading.value = false;
    }

    const setUpdateFormVisible = (val) => {
        updateFormVisible.value = val ;
    }
   
   const updateSubmit = async (value, resetFields) => {
     updateSubmitLoading.value = true ;
     await globalUpdateReq(value.id, value).then(response => {
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


    const tmpPagination = {
      global_filter: true 
    }

    const dataList = ref([])
    const getAllKey = () => {
      keyListReq(tmpPagination).then(response => {
        dataList.value = response.data
      })
    }
    onMounted(() => {
      getList(1),
      getAllKey()
    })

    return {
      t,
      listLoading,
      pagination,
      getList,
      getAllKey,
      dataList,
      totalPage,
      handleFilter,
      handleDelete,
      handleUpdate,
      cancelEvent,
      keyData: tableData,
      createFormVisible,
      updateFormVisible,
      searchFormVisible,
      setCreateFormVisible,
      setUpdateFormVisible,
      setSearchFormVisible,
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
