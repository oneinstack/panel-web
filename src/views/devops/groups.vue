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
    <!-- 
    @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      -->
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
        :label="$t('table.name')"
        align="center"
        prop="name">
      </el-table-column>

      <el-table-column
        :label="$t('table.remark')"
        align="center"
        prop="remark">
      </el-table-column>

      <el-table-column
        :label="$t('table.ops_manager_by')"
        align="center"
        width="80"
        prop="ops_manager_by">
      </el-table-column>

      <el-table-column
        :label="$t('table.dev_manager_by')"
        align="center"
        width="80"
        prop="dev_manager_by">
      </el-table-column>
    
      <el-table-column
        :label="$t('table.comment')"
        align="center"
        prop="comment">
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
      @pagination="(p) => {getList(p || 1)}"
    />

    <create-groups
      :visible="createFormVisible"
      :on-cancel="() => setCreateFormVisible(false)" 
      :on-submit-loading="createSubmitLoading" 
      :on-submit="createSubmit"
    /> 

    <update-groups
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
import { groupListReq, groupCreateReq, groupUpdateReq, groupDeleteBatchReq} from '@/api/groups'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import { useI18n } from 'vue-i18n'
import { reactive, ref, toRefs, computed, onMounted } from 'vue'
import { ElMessage } from "element-plus";

import CreateGroups from './components/createGroups.vue';
import UpdateGroups from './components/updateGroups.vue'
 

export default {
  name: 'Key',
  components: {Pagination,CreateGroups,UpdateGroups},
  directives: { waves },
  setup() {
    const { t } = useI18n();
    const store = useStore();
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
      await groupListReq(pagination).then(response => {
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
    await groupDeleteBatchReq(val.id).then(response => {
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

    const createSubmit = (values, resetFields) => {
        createSubmitLoading.value = true;
        groupCreateReq(values).then(response => {
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

     const updateSubmit = async (value, resetFields) => {
     updateSubmitLoading.value = true ;
     await groupUpdateReq(value.id, value).then(response => {
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
      handleUpdate,
      handleDelete,
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