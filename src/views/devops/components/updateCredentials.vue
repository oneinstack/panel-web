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
                <el-input v-model="modelRef.name" placeholder="名称" style="width:100%" size="mini"/>
            </el-form-item>
            <el-form-item :label="$t('table.type')" prop="type" >
                <el-select v-model="modelRef.type" placeholder="类型" size="mini">
                    <el-option v-for="(k,v) in types" :key="v" :label="k" :value="k" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.address')" prop="address" >
                <el-input v-model="modelRef.address" placeholder="地址"  size="mini"/>
            </el-form-item>
            <el-form-item :label="$t('table.key')" prop="key" >
                <el-input v-model="modelRef.key" placeholder="键"  size="mini"/>
            </el-form-item>
            <el-form-item :label="$t('table.value')" prop="value" >
                <el-input v-model="modelRef.value" placeholder="值"  size="mini"/>
            </el-form-item>
            <el-form-item :label="$t('table.comment')" prop="comment" >
                <el-input v-model="modelRef.comment" placeholder="备注"  size="mini"/>
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
        const types = ["gitlab", "jenkins", "harbor", "aliyun_acr", "huawei_swr", "aliyun_ak_sk", "huawei_ak_sk", "kubeconfig"]
        const modelRef = reactive({
            id: props.values.id ,
            name:  props.values.name || '',
            address: props.values.address || '',
            key: props.values.key || '',
            value: props.values.value || '',
            type: props.values.type || '',
            comment: props.values.comment || ''
        });

        const rulesRef = reactive({
            id: [],
            name: [
                {
                    required: true,
                },
            ],
            address: [
                {
                    required: true,
                }
            ], 
            key: [
                {
                    required: true,
                }
            ],
            value: [
                {
                    required: true,
                },
            ],
            type: [
                {
                    required: true,
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
            types
        }
    },
})
</script>
