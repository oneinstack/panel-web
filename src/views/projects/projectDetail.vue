<template>
  <div class="app-container">
      <el-card class="project-detail-box-card">
        <template #header>
          <div class="card-header">
            <span>{{ project_detail.name }}服务详情</span>
          </div>
        </template>
        <el-row>
          <el-col :span="6" style="padding-left: 15px">
            <div class="project-detail-box-col">服务中文名: {{ project_detail.remark}} </div>
            <div class="project-detail-box-col">服务组:  {{ project_detail.group }}</div>
            <div class="project-detail-box-col">中文描述: {{ project_detail.comment }}</div>
          </el-col>
          <el-col :span="8" style="padding-left: 15px" >
            <div class="project-detail-box-col">GIT仓库: {{ project_detail.git_repo }}</div>
            <div class="project-detail-box-col">运行端口: {{ project_detail.port }}</div>
            <div class="project-detail-box-col">运维负责人: {{ project_detail.ops_by }}</div>
          </el-col>
          <el-col :span="6" style="padding-left: 15px">
            <div class="project-detail-box-col">开发语言: {{ project_detail.language }} </div>
            <div class="project-detail-box-col">语言版本: {{ project_detail.language_version }}</div>
            <div class="project-detail-box-col">开发负责人: {{ project_detail.dev_by }}</div>
          </el-col>
          <el-col :span="4" style="padding-left: 15px">
            <el-button type="primary" round style="height: 50px; width:60px" @click="handleDeploy">发布</el-button>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="project-detail-box-card">
        <template #header>
          <div class="card-header">
            <span>CICD操作</span>
          </div>
        </template>
        <el-row>
          <el-col>
              <el-tabs
                v-model="activeName"
                class="demo-tabs"
                @tab-click="handleClick"
              >
                <el-tab-pane label="配置" name="config">
                  <el-tabs tab-position="left"  @tab-click="handleProjectsClick">
                    <el-tab-pane v-for="(k,v) in configEnv" :key="v" :label="k" :lazy="true">
                        <config-projects 
                          :env="model_env" 
                          :envs="configEnv"
                          :projects="project_detail"
                          :table-data="tableData" 
                          :total-page="totalPage" 
                          :on-refresh="onRefresh"
                        >
                        </config-projects>
                    </el-tab-pane>
                  </el-tabs>
                </el-tab-pane>
                <el-tab-pane label="部署" name="deployment">
                    <deployment
                    v-if="activeName == 'deployment'"
                    :env="model_env"
                    :projects="project_detail"
                    >
                    </deployment>
                </el-tab-pane>
                <el-tab-pane label="成员" name="account">
                    <account></account>
                </el-tab-pane>
              </el-tabs>

          </el-col>
        </el-row>
      </el-card>
  </div>
</template>

<script>
import {
 projectsConfigListReq,
 projectsConfigCreateReq,
 projectsConfigUpdateReq,
 projectsConfigDeleteBatchReq
} from '@/api/configProjects'

import {
 projectsSearchReq,
} from '@/api/projects'

import {
  envsGetReq
} from '@/api/env'
  
  import { useRoute } from 'vue-router'
  import { onBeforeMount, onMounted, reactive, ref } from 'vue'
  import configProjects from './components/configProjects.vue'
  import deployment from './components/deployment.vue'
  import account from './components/account.vue'
 

  export default {
    name: 'ProjectDetail',
    components: {configProjects, deployment, account},
    setup() {
      const configEnv = reactive([])
      const listLoading = ref(false)
      const tableData = ref()
      const totalPage = ref(0);
      const model_env = ref('dev')
      const activeName = ref('config')
      const route = useRoute()
      const router = useRouter()
      const project_detail = ref({
        group: '',
        language: '',
        language_version: '',
        name: '',
        ops_by: [],
        dev_by: [],
        port: 0,
        remark: '',
        status: true,
        deploy_status: '',
        comment: '',
        git_repo: ''
      })

      const getListEnvs = async () => {
        await envsGetReq({}).then(response => {
          if(response.data) {
            response.data.map( res => {
              configEnv.push(res.name)
            })
          }
        })
      }

      const handleClick = async (tab) => {
        activeName.value = tab.props.name
        sessionStorage.setItem("activeName", tab.props.name)
      }

     
      const getActive = () => {
        if (sessionStorage.getItem('activeName') !== null) {
          activeName.value = sessionStorage.getItem('activeName')
        }
      }

      const pagination = reactive({
        page: 1,
        per_page: 10,
        env: "dev",
        group: '',
        project: ''
      })

      const initConfig = async (current) => {
        listLoading.value = true
        pagination.page = current.page
        pagination.per_page = current.limit || pagination.per_page
        pagination.env = model_env.value
        await getListProjects();
        pagination['group'] = project_detail.value.group
        pagination['project'] = project_detail.value.name
        await projectsConfigListReq(pagination).then(response => {
            tableData.value = response.data;
            totalPage.value = Number(response.headers['total-pages'])
        })
      }


      const getListProjects = () => {
          let id = route.params?.id 
          return projectsSearchReq(id).then(response => {
            project_detail.value = response.data ;
          })
      }

      const handleProjectsClick = (tab,event) => {
        model_env.value = tab.props.label;
        initConfig(1)
      }


    
      const onRefresh = (current) => {
        initConfig(current)
        // window.location.reload();
      }

      const handleDeploy = () => {
        router.push({
          path: '/projectDeployment',
          query: {
            group: project_detail.value.group,
            project: project_detail.value.name
          }
        })
      }

      onMounted(() => {
        initConfig(1),
        getListEnvs(),
        getActive()
      })

    return {
      configEnv,
      model_env,
      activeName,
      handleClick,
      initConfig,
      handleProjectsClick,
      tableData,
      totalPage,
      project_detail,
      onRefresh,
      handleDeploy
    }
  },
}
</script>


<style scoped>
 .project-detail-box-card {
   margin-top:  5px;
   margin-bottom: 10px;
 }
 .project-detail-box-col {
   font-size: 14px;
   margin-bottom: 14px;
   line-height: 1.5;
 }

 .demo-tabs > .el-tabs__content {
  padding: 32px;
  background-color: #f4f5f7;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>