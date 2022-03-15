<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="ConfigKey多条件搜索"
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
            <el-form-item :label="$t('table.value_rule')" prop="value_rule" >
                <el-input v-model="modelRef.value_rule" placeholder="规则"  size="mini"/>
            </el-form-item>
            <el-form-item :label="$t('table.status')" prop="status">
                <el-switch v-model="modelRef.status" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ElForm, ElMessage } from "element-plus";
import { reactive, ref } from 'vue'


export default ({
    name: 'SearchConfigKey',
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
    },
    setup(props) {
        const { t } = useI18n();

         // 表单值
        const modelRef = reactive({
            name: '',
            remark:  '',
            value_rule:  '',
            status: true ,
        });

        const rulesRef = reactive({});
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
