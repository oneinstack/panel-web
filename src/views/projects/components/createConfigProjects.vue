<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="configProjects创建"
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
                <el-input v-model="modelRef.group" placeholder="组" style="width:100%" size="mini" disabled/>
            </el-form-item>
            <el-form-item :label="$t('table.name')" prop="project" >
                <el-input v-model="modelRef.project" placeholder="项目" size="mini"  disabled/>
            </el-form-item>
             <el-form-item :label="$t('table.env')" prop="env" >
                <el-select v-model="modelRef.env"  placeholder="环境" size="mini" disabled>
                    <el-option v-for="(k,v) in envs" :key="v" :label="k" :value="k" />
                </el-select>
            </el-form-item>
             <el-form-item :label="$t('table.key')" prop="key">
            <el-select v-model="modelRef.key" placeholder="名称" filterable size="mini" @change="selectName" >
                <el-option v-for="(item,index) in selectData" :key="index.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.remark')" prop="remark" >
                <el-input v-model="modelRef.remark" placeholder="中文名" size="mini"  disabled/>
            </el-form-item>
            <el-form-item :label="$t('table.value_type')" prop="value_type" >
                <el-select v-model="modelRef.value_type" placeholder="类型" size="mini" disabled>
                    <el-option label="string" value="string"/>
                    <el-option label="uint" value="uint"/>
                    <el-option label="bool" value="bool"/>
                    <el-option label="float" value="float"/>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.value')" prop="value" >
                <el-input v-model="modelRef.value" placeholder="值" size="mini" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ElForm, ElMessage } from "element-plus";
import { reactive, ref } from 'vue'


export default ({
    name: 'CreateConfigProjects',
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
        env: {
            type: String,
            require: true
        },
        envs: {
            type: Array,
            require: true
        },
        projects: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const { t } = useI18n();

         // 表单值
        const modelRef = reactive({
            group: props.projects?.group,
            project: props.projects?.name,
            env: props.env,
            key: '',
            value: '',
            remark: '',
            value_type: ''
        });

        const rulesRef = reactive({
            id: [],
            env: [
                {
                    required: true,
                },
            ],
            remark: [
                {
                    required: true,
                }
            ], 
            project: [
                {
                    required: true,
                }
            ],
            group: [
                {
                    required: true,
                },
            ],
            key: [
                {
                    required: true,
                },
            ],
            value: [
                {
                    required: true
                }
            ]      
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

        return {
            modelRef,
            rulesRef,
            formRef,
            resetFields,
            onFinish,
            selectName
        }
    },
})
</script>
