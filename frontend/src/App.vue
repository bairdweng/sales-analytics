<template>
  <n-config-provider :theme="theme">
    <n-layout style="height: 100vh">
      <n-layout-header bordered>
        <n-space justify="space-between" align="center" style="padding: 0 24px; height: 64px">
          <n-h1 style="margin: 0; font-size: 24px; color: #18a058; cursor: pointer;" @click="goHome">
            🛍️ 本地选品管理工具
          </n-h1>
          <n-space>
            <n-button 
              @click="goHome" 
              type="primary" 
              size="medium"
              :ghost="$route.path !== '/'"
            >
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                </n-icon>
              </template>
              商品列表
            </n-button>
            <n-button 
              @click="handleAddProduct" 
              type="primary" 
              size="large"
              style="background: linear-gradient(135deg, #18a058 0%, #36ad6a 100%); border: none; box-shadow: 0 4px 12px rgba(24, 160, 88, 0.3);"
              :hover-style="{ background: 'linear-gradient(135deg, #36ad6a 0%, #52c41a 100%)', transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(24, 160, 88, 0.4)' }"
            >
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </n-icon>
              </template>
              <span style="font-weight: 600;">新增商品</span>
            </n-button>
          </n-space>
        </n-space>
      </n-layout-header>
      
      <n-layout-content style="padding: 24px">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { darkTheme } from 'naive-ui'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const theme = darkTheme

const goHome = () => {
  router.push('/')
}

const handleAddProduct = () => {
  console.log('新增商品按钮被点击')
  // 跳转到首页，并触发新增商品表单显示
  router.push('/')
  // 使用事件总线或全局状态来触发表单显示
  // 这里我们使用简单的延迟来确保页面切换完成
  setTimeout(() => {
    // 触发自定义事件来显示表单
    window.dispatchEvent(new CustomEvent('show-product-form'))
  }, 100)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>