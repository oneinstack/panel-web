<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="configProjects修改"
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
                <el-input v-model="modelRef.group" placeholder="组" style="width:100%" size="mini"/>
            </el-form-item>
            <el-form-item :label="$t('table.name')" prop="project" >
                <el-input v-model="modelRef.project" placeholder="项目" size="mini" />
            </el-form-item>
             <el-form-item :label="$t('table.env')" prop="env" >
                <el-select v-model="modelRef.env"  placeholder="环境" size="mini" disabled>
                    <el-option label="dev" value="dev" />
                    <el-option label="test" value="test" />
                    <el-option label="pre" value="pre" />
                    <el-option label="prd" value="prd" />
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
    name: 'UpdateConfigProjects',
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
            group:  props.values.group,
            project:  props.values.project,
            env:  props.values.env,
            key:  props.values.key,
            value:  props.values.value,
            remark:  props.values.remark,
        });


        const rulesRef = reactive({
            id: [],
            name: [
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
