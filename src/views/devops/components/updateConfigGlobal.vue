<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="修改全局Key"
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
            <el-form-item :label="$t('table.key')" prop="key">
                <el-input v-model="modelRef.key" disabled="true" placeholder="键" size="mini"></el-input>
            </el-form-item>
            <el-form-item :label="$t('table.value')" prop="value" >
                <el-input v-model="modelRef.value" placeholder="值"  size="mini" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ElForm, ElMessage } from "element-plus";
import { reactive, ref, toRef } from 'vue'


export default ({
    name: 'UpdateConfigGloabl',
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
        selectData: {
            // type: Array,
            require: true
        },
        values: {
            type: Object,
            require: true
        }
    },
    setup(props) {
        const { t } = useI18n();

         // 表单值
        const modelRef = reactive({
            id: props.values.id || 0,
            key: props.values.key || '',
            value: props.values.value 
        });

        const rulesRef = reactive({
            id: [],
            key: [
                {
                    required: true,
                },
            ],
            remark: [
                {
                    required: true,
                }
            ], 
            value_type: [
                {
                    required: true
                }
            ],
            value: [
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

        const selectName = (name,item) => {
           props.selectData?.forEach((v) => {
               if (v.name == name) {
                   modelRef.remark = v.remark
                   modelRef.value_type = v.value_type
               }
           })
        }

        onMounted(() => {
        })

        return {
            modelRef,
            rulesRef,
            formRef,
            resetFields,
            onFinish,
            selectName,
        }
    },
})
</script>
