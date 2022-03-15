<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="Project修改"
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
            <el-form-item :label="$t('table.group')" prop="group">
                <el-input v-model="modelRef.group" placeholder="组名" style="width:100%" size="mini" disabled/>
            </el-form-item>
            <el-form-item :label="$t('table.name')" prop="name" >
                <el-input v-model="modelRef.name" placeholder="项目" size="mini" disabled />
            </el-form-item>
            <el-form-item :label="$t('table.git_repo')" prop="git_repo" >
                <el-input v-model="modelRef.git_repo" placeholder="Git地址" size="mini" />
            </el-form-item>
            <el-form-item :label="$t('table.language')" prop="language" >
                <el-select v-model="modelRef.language" placeholder="开发语言" size="mini">
                    <el-option v-for="(k,v) in languages" :key="v" :label="k" :value="k"/>
                </el-select>
            </el-form-item>
             <el-form-item :label="$t('table.language_version')" prop="language_version" >
                <el-input v-model="modelRef.language_version" placeholder="语言版本" size="mini" />
            </el-form-item>
            <el-form-item :label="$t('table.ops_by')" prop="ops_by" >
                <el-select 
                    v-model="modelRef.ops_by" 
                    placeholder="运维负责人"  
                    size="mini" 
                    allow-create 
                    filterable 
                    default-first-option
                    multiple 
                />
            </el-form-item>
            <el-form-item :label="$t('table.dev_by')" prop="dev_by" >
                 <el-select 
                    v-model="modelRef.dev_by" 
                    placeholder="开发负责人"  
                    size="mini" 
                    allow-create 
                    filterable 
                    default-first-option
                    multiple 
                />
            </el-form-item>
            <el-form-item :label="$t('table.port')" prop="port" >
                <el-input-number v-model="modelRef.port" placeholder="端口" size="mini" />
            </el-form-item>
            <el-form-item :label="$t('table.remark')" prop="remark" >
                <el-input v-model="modelRef.remark" placeholder="中文名" size="mini" />
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
    name: 'UpdateProjects',
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
            id: props.values.id ,
            dev_by: props.values.dev_by || [],
            git_repo: props.values.git_repo || '',
            group: props.values.group || '',
            language: props.values.language || '',
            language_version: props.values.language_version ,
            name: props.values.name || '',
            ops_by: props.values.ops_by || [],
            port: props.values.port || 0,
            remark: props.values.remark || '',
            status: props.values.status
        });



      
        const rulesRef = reactive({
            id: [],
            dev_by: [
                {
                    required: true,
                },
            ],
            remark: [
                {
                    required: true,
                }
            ], 
            git_repo: [
                {
                    required: true,
                }
            ],
            group: [
                {
                    required: true,
                },
            ],
            language: [
                {
                    required: true,
                },
            ],
            name: [
                {
                    required: true
                }
            ],
            ops_by: [
                {
                    required: true
                }
            ],
            port: [
                {
                    required: true
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
