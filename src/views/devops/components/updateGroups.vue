<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="修改ConfigKey"
      width="500px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <span class="dialog-footer">
                <el-button key="back" @click="() => onCancel()">取消</el-button>
                <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</el-button>
            </span>
        </template>
        <el-form ref="formRef" :model="modelRef" :rules="rulesRef" label-width="80px">
            <el-form-item :label="$t('table.name')" prop="name">
                <el-input v-model="modelRef.name" placeholder="组名" style="width:100%" size="mini"/>
            </el-form-item>
            <el-form-item :label="$t('table.dev_manager_by')" prop="dev_manager_by" >
                 <el-select 
                    v-model="modelRef.dev_manager_by" 
                    placeholder="开发负责人"  
                    size="mini" 
                    allow-create 
                    filterable 
                    default-first-option
                    multiple 
                />
            </el-form-item>
            <el-form-item :label="$t('table.ops_manager_by')" prop="ops_manager_by" >
                <el-select 
                    v-model="modelRef.ops_manager_by" 
                    placeholder="运维负责人"  
                    size="mini" 
                    allow-create 
                    filterable 
                    default-first-option
                    multiple 
                />
            </el-form-item>
            <el-form-item :label="$t('table.remark')" prop="remark" >
                <el-input v-model="modelRef.remark" placeholder="中文名" size="mini" />
            </el-form-item>
            <el-form-item :label="$t('table.comment')" prop="comment" >
                <el-input v-model="modelRef.comment" placeholder="备注" size="mini" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ElForm, ElMessage } from "element-plus";
import { reactive, ref } from 'vue'


export default ({
    name: 'UpdateConfigKey',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        },
        onSubmitLoading: {
            type: Boolean,
            required: true
        },
        onSubmit: {
            type: Function ,
            required: true
        },
        values: {
            type: Object,
            require: true
        }
    },
    setup(props) {
        const { t } = useI18n();

        const modelRef = reactive({
            id: props.values.id || 0,
            name: props.values.name || '',
            remark: props.values.remark || '',
            dev_manager_by: props.values.dev_manager_by || [],
            ops_manager_by: props.values.ops_manager_by || [],
            comment: props.values.comment || ''
        });

        const rulesRef = reactive({
            id: [],
            name: [
                {
                    required: true,
                },
            ],
            dev_manager_by: [
                {
                    required: true,
                }
            ], 
            ops_manager_by: [
                {
                    required: true,
                }
            ], 
        });
        // form
        const formRef = ref();
        
        // 重置
        const resetFields = () => {
            formRef.value?.resetFields();
        }

        // 提交
        const onFinish =  async () => {      
            try {
                const valid = await formRef.value?.validate();
                if(valid === true) {
                    props.onSubmit(modelRef, resetFields);
                }
            } catch (error) {
                console.log('error', error);
                // ElMessage.warning(t('devops.onFinish'));
                ElMessage.warning(error)
            }
        };

        return {
            modelRef,
            rulesRef,
            formRef,
            resetFields,
            onFinish,
        }
    },
})
</script>
