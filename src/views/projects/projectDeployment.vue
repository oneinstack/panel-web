<template>
  <div class="app-container">
      <el-card class="project-detail-box-card">
        <template #header>
          <div class="card-header">
            <span>服务发布</span>
          </div>
        </template>
        <div class="row-card">
            <el-row>
              <el-col :span="8">
                <el-form ref="formRef" :model="modelRef" :rules="rulesRef" label-width="80px">
                    <el-form-item :label="$t('table.group')" prop="group" >
                        <el-select v-model="modelRef.group" placeholder="组名"  size="mini"/>
                    </el-form-item>
                    <el-form-item :label="$t('table.project')" prop="project"  >
                        <el-select v-model="modelRef.project" placeholder="项目名" size="mini" />
                    </el-form-item>
                    <el-form-item :label="$t('table.tag')" prop="tag"  >
                        <el-select v-model="modelRef.tag" placeholder="镜像tag" size="mini" />
                    </el-form-item>
                    <el-form-item :label="$t('table.env')" prop="env"  >
                        <el-select v-model="modelRef.env" placeholder="环境" size="mini" />
                    </el-form-item>
                    <el-form-item :label="$t('table.action')" prop="action"  >
                        <el-select v-model="modelRef.action" placeholder="动作" size="mini" >
                            <el-option label='deploy' value='deploy'></el-option>
                            <el-option label='rollback ' value='rollback '></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item :label="$t('table.description')" prop="description"  >
                        <el-input  v-model="modelRef.description" placeholder="描述" size="mini"  style="width: 220px" />
                    </el-form-item>
                </el-form>
              </el-col>
            </el-row>
        </div>

        <div class="row-card">
          <el-row>
            <el-col :span="8">
              
            </el-col>
          </el-row>
        </div>
      </el-card>
    
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
 export default {
    name: 'ProjectDetail',
    components: {},
    setup() {
      const modelRef = reactive({
        action: '',
        created_by: '',
        env: '',
        group: '',
        project: '',
        tag: '',
        description: ''
      })
      const rulesRef = reactive({
        group: [{
          type: String,
          required: true
        }],
        env: [{
          type: String,
          required: true
        }],
        project: [{
          type: String,
          required: true
        }],
        tag: [{
          type: String,
          required: true
        }],
        action: [{
          type: String,
          required: true
        }],
      })
      const formRef = ref();
      const route = useRoute()
      
      return {
        modelRef,
        rulesRef,
        formRef
      }
    }
 }
</script>

<style scoped>

  .app-container {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
  }
  .project-detail-box-card {
    height: 100%;
    margin-inline: auto;
  }

  .project-deploy {
    width: 50%;
    height: 100%;
  }

</style>