<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="Project创建"
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
                <el-select v-model="modelRef.group" placeholder="组名" size="mini">
                    <el-option v-for="(k,v) in groups" :key="v" :label="k"  :value="k"  />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.name')" prop="name" >
                <el-input v-model="modelRef.name" placeholder="项目" size="mini" />
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
        </el-form>
    </el-dialog>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ElForm, ElMessage } from "element-plus";
import { onMounted, reactive, ref } from 'vue'

import { groupListReq } from '@/api/groups'

export default ({
    name: 'CreateProject',
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
            type: Array,
            require: true
        },
        envs: {
             type: Array,
            require: true
        }
    },
    setup(props) {
        const { t } = useI18n();
        const groups = ref([]);
        const languages = ['java', 'go', 'python3', 'nodejs', 'static' ]
        const modelRef = reactive({
            dev_by: [],
            git_repo: '',
            group: '',
            language: '',
            language_version: '',
            name: '',
            ops_by: [],
            port: 0,
            remark: ''
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
    
        const formRef = ref();
        
        const resetFields = () => {
            formRef.value?.resetFields();
        }

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
        
        const getListGroup = () => {
            groupListReq().then(response => {
                response.data.forEach(item => {
                    groups.value.push(item.name)
                })
            })
        }

        onMounted(() => {
            getListGroup()
        })

        return {
            modelRef,
            rulesRef,
            formRef,
            resetFields,
            onFinish,
            selectName,
            languages,
            groups
        }
    },
})
</script>
