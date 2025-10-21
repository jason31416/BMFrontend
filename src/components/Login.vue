<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import JSEncrypt from 'jsencrypt'
import cookies from "vue-cookies"
import constants from "./const.vue"
import { useMessages } from '../composables/useMessages.js'

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const router = useRouter()
const { addMessage } = useMessages()

// cookies.set('23333test', "114514", "60s")

function setCookie(name, value, days) {
    cookies.set(name, value, days + "d")
}

function login() {
    isLoading.value = true

    axios.post(constants.uniauthurl + '/webapi/login', {
        username: username.value,
        password: password.value
    }).then(res => {
        if (res.data["success"] == true) {
            setCookie('ua.sid', res.data["token"], 7)
            addMessage('success', '登录成功! 欢迎回来, '+username.value+"~", 2000)
            router.push('/');
        } else {
            addMessage('error', res.data["message"] || '登录失败: 未知错误!', 5000)
            isLoading.value = false
        }
    }).catch(error => {
        console.error('Error logging in after registration:', error);
        addMessage('error', '登录失败: '+error+'!', 5000)
        isLoading.value = false
    });
}
</script>

<template>
    <div class="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="bg-white py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-blue-100">
                <h2 class="py-10 text-center text-3xl font-bold text-gray-900">
                    登录到您的账户
                </h2>

                <div class="space-y-6">
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-900">
                            用户名
                        </label>
                        <div class="mt-1">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                v-model="username"
                                :disabled="isLoading"
                                class="appearance-none block w-full px-3 py-2 border border-blue-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-blue-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-900"
                                placeholder="请输入您的游戏内用户名"
                            />
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-900">
                            密码
                        </label>
                        <div class="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                v-model="password"
                                :disabled="isLoading"
                                class="appearance-none block w-full px-3 py-2 border border-blue-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-blue-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            @click="login"
                            :disabled="isLoading"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg"
                        >
                            <span v-if="isLoading">登录中...</span>
                            <span v-else>登录</span>
                        </button>
                    </div>
                </div>

                <div class="mt-6 text-center">
                    <p class="text-xs text-gray-700">
                        还没有账户？ 
                        <router-link to="/auth/register" class="text-blue-400 hover:text-blue-500 transition ease-in-out duration-300 font-medium">
                            立即注册
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Additional styles for Vue components if needed */
</style>
