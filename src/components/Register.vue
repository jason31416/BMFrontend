<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessages } from '../composables/useMessages.js'
import axios from 'axios'
import constants from './const.vue'

import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

// Form data
const username = ref('')
const email = ref('')
const password = ref('')
const verificationCode = ref('')

// UI state
const isLoading = ref(false)
const isRegisterLoading = ref(false)
const currentStage = ref(1) // 1: Basic info, 2: Verification code
const isCodeSent = ref(false)
const router = useRouter()
const { addMessage } = useMessages()

const captcha = ref(null);

function verifyCallback(token, ekey) {
    captcha.value = token;
}

function sendVerificationCode() {
    if (!username.value || !email.value || !password.value || !captcha.value) {
        addMessage('error', '请填写所有必填字段')
        return
    }

    isLoading.value = true
    currentStage.value = 2

    axios.post(constants.uniauthurl + '/webapi/register', {
        username: username.value,
        email: email.value,
        hcaptcharesponse: captcha.value,
    }).then(res => {
        if (res.data["success"] !== true) {
            addMessage('error', res.data["message"] || '发送验证码失败，请稍后再试')
            currentStage.value = 1
            isLoading.value = false
            return
        }
        addMessage('success', '验证码已发送到您的邮箱，请查收')
        isLoading.value = false
        isCodeSent.value = true
    }).catch(error => {
        addMessage('error', '发送验证码失败，请稍后再试!')
        console.error('Error sending verification code:', error)
        currentStage.value = 1
        isLoading.value = false
    })
}

function returnToFirstStage() {
    currentStage.value = 1
    isCodeSent.value = false
    isLoading.value = true
    verificationCode.value = ''
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
}

function setCookie(name, value, days) {
    cookies.set(name, value, days + "d")
}

function completeRegistration() {
    if (!verificationCode.value) {
        addMessage('error', '请输入验证码')
        return
    }

    isLoading.value = true

    axios.post(constants.uniauthurl + '/webapi/verifyemail', {
        username: username.value,
        email: email.value,
        password: password.value,
        code: verificationCode.value
    }).then(res => {
        if (res.data["success"] !== true) {
            addMessage('error', res.data["message"] || '注册失败，请稍后再试')
            isLoading.value = false
            return
        }

        axios.post(constants.uniauthurl + '/webapi/login', {
            username: username.value,
            password: password.value
        }).then(res => {
            if (res.data["success"] == true) {
                setCookie('ua.sid', res.data["token"], 7)
                addMessage('success', '注册成功! 欢迎, ' + username.value + "~", 3000)
                router.push('/');
            } else {
                addMessage('error', res.data["message"] || '登录失败: 未知错误!', 5000)
                isLoading.value = false
                router.push('/auth/login');
            }
        }).catch(error => {
            console.error('Error logging in after registration:', error);
            addMessage('error', '登录失败: ' + error + '!', 5000)
            isLoading.value = false
            router.push('/auth/login');
        });
    }).catch(error => {
        addMessage('error', '注册失败，请稍后再试')
        console.error('Error completing registration:', error)
        isLoading.value = false
    })
}
</script>

<template>
    <div class="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div
                class="bg-white py-8 px-6 shadow-lg rounded-xl sm:px-10 border border-blue-100 transition-all duration-500 ease-in-out">
                <h2 class="text-center text-3xl font-bold text-gray-900 transition-all duration-500"
                    :class="{'py-4': currentStage === 2, 'py-10': currentStage===1}">
                    注册新账户
                </h2>

                <div class="space-y-6 transition-all duration-500" :class="{'space-y-4': currentStage === 2}">
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-900">
                            用户名
                        </label>
                        <div class="mt-1">
                            <input id="username" name="username" type="text" autoComplete="username" required
                                v-model="username" :disabled="isLoading || currentStage === 2"
                                class="appearance-none block w-full px-3 py-2 border border-blue-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-blue-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-900"
                                placeholder="请输入您的Minecraft用户名" />
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-900">
                            密码
                        </label>
                        <div class="mt-1">
                            <input id="password" name="password" type="password" autoComplete="new-password" required
                                v-model="password" :disabled="isLoading || currentStage === 2"
                                class="appearance-none block w-full px-3 py-2 border border-blue-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-blue-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-900"
                                placeholder="••••••••" />
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-900">
                            邮箱地址
                        </label>
                        <div class="mt-1">
                            <input id="email" name="email" type="email" autoComplete="email" required v-model="email"
                                :disabled="isLoading || currentStage === 2"
                                class="appearance-none block w-full px-3 py-2 border border-blue-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-blue-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-900"
                                placeholder="请输入您的邮箱地址" />
                        </div>
                    </div>

                    <div class="flex justify-center">
                        <vue-hcaptcha sitekey="6372443e-7d72-4ae6-92ca-64b6924877dc" @verify="verifyCallback"/>
                    </div>

                    <div class="flex max-h-12" :class="{'space-x-4': currentStage===2}">
                        <div class="transition-all duration-500 ease-in-out" :class="{'flex-1': currentStage===2}"
                            :style="{ 'width': currentStage === 1 ? '0' : 'auto', 'opacity': currentStage === 1 ? 0 : 1 }">
                            <input id="verificationCode" name="verificationCode" type="text" required
                                v-model="verificationCode" :disabled="isLoading"
                                class="w-full py-2 border border-blue-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-blue-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-900"
                                :class="{ 'px-3': currentStage === 2, 'px-0': currentStage === 1 }"
                                placeholder="请输入验证码" />
                        </div>
                        <button @click="currentStage===1?sendVerificationCode():returnToFirstStage()"
                            :disabled="isLoading"
                            class="flex transition-all duration-500 ease-in-out justify-center py-2 border border-transparent text-sm font-medium rounded-lg text-white hover:bg-blue-600 focus:outline-none disabled:cursor-not-allowed active:scale-[0.98] shadow-md hover:shadow-lg"
                            :class="{ 'shrink-1': currentStage === 2, 'flex-1': currentStage === 1, 'bg-blue-400': currentStage === 2, 'px-7': currentStage === 2, 'bg-blue-400': currentStage === 2, 'bg-blue-500': currentStage === 1}">
                            <span :hidden="!isLoading">
                                <span class="px-1" style="animation: bounce 1s linear 0s infinite">.</span>
                                <span class="px-1" style="animation: bounce 1s linear 250ms infinite">.</span>
                                <span class="px-1" style="animation: bounce 1s linear 500ms infinite">.</span>
                            </span>
                            <span :hidden="currentStage === 1 || isLoading">返回</span>
                            <span :hidden="currentStage === 2 || isLoading">发送验证码</span>
                        </button>
                    </div>

                    <button :hidden="currentStage !== 2" @click="completeRegistration" :disabled="isRegisterLoading"
                        class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed active:scale-[0.98] shadow-md hover:shadow-lg fade-drop-button">
                        <span v-if="isRegisterLoading">注册中...</span>
                        <span v-else>完成注册</span>
                    </button>
                </div>

                <div class="mt-6 text-center">
                    <p class="text-xs text-gray-700">
                        已有账户？
                        <router-link to="/auth/login"
                            class="text-blue-400 hover:text-blue-500 transition ease-in-out duration-300 font-medium">
                            立即登录
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-drop-button {
  animation: fadeDropIn 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes fadeDropIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(-25px);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
        transform: none;
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
}
</style>
