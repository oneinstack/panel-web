<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="新增ConfigKey"
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
                <el-input v-model="modelRef.name" placeholder="名称" style="width:100%" size="mini"/>
            </el-form-item>
            <el-form-item :label="$t('table.remark')" prop="remark" >
                <el-input v-model="modelRef.remark" placeholder="中文名" size="mini" />
            </el-form-item>
            <el-form-item :label="$t('table.value_type')" prop="value_type" >
                <el-select v-model="modelRef.value_type" placeholder="类型" size="mini">
                    <el-option label="string" value="string"/>
                    <el-option label="uint" value="uint"/>
                    <el-option label="bool" value="bool"/>
                    <el-option label="float" value="float"/>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.value_rule')" prop="value_rule" >
                <el-input v-model="modelRef.value_rule" placeholder="规则"  size="mini"/>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ElForm, ElMessage } from "element-plus";
import { reactive, ref } from 'vue'


export default ({
    name: 'CreateConfigKey',
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
        }
    },
    setup(props) {
        const { t } = useI18n();

         // 表单值
        const modelRef = reactive({
            name: '',
            remark: '',
            value_rule: '',
            value_type: ''
        });

        const rulesRef = reactive({
            id: [],
            name: [
                {
                    required: true,
                    // validator: async (rule, value) => {
                    //     if (value === '' || !value) {
                    //         throw new Error('请输入名称');
                    //     } else if (value.length > 15) {
                    //         throw new Error('长度不能大于15个字');
                    //     }
                    // }
                },
            ],
            remark: [
                {
                    required: true,
                }
            ], 
            value_type: [
                {
                    required: true,
                }
            ],
             value_rule: [
                {
                    required: false,
                },
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
