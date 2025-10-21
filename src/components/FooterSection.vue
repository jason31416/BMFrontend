<!-- components/FooterSection.vue -->
<template>
    <footer>
        <div class="footer-content">
            <div>
                <h4>快捷链接</h4>
                <ul>
                    <li><a href="/map/survival-1">养老服地图</a></li>
                    <!-- <li><a href="/map/kingdoms">国战服地图</a></li> -->
                    <li href="https://pastebin.com/dMKttD1D">玩家守则</li>
                    <li><a href="mailto://admin@block-max.cn">遇到问题? 发送邮件至: admin@block-max.cn</a></li>
                </ul>
            </div>
            <div>
                <h4>玩家交流群</h4>
                <ul>
                    <li><a href="https://qm.qq.com/q/zTMIqFCtVu">QQ - 680152769</a></li>
                    <li>微信 - 请添加jason31416并备注bm</li>
                </ul>
            </div>
            <div>
                <h4>友情链接</h4>
                <ul>
                    <li><a href="https://cubexmc.top/">CubeX生存服务器</a></li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<style scoped>
footer {
    background: #1e293b;
    padding: 3rem 5%;
    padding-top: 1rem;
    margin-top: 5rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}

h4 {
    color: #7dd3fc;
    margin-bottom: 1rem;
}

ul {
    list-style: none;
}

li {
    margin-bottom: 0.5rem;
}

a {
    color: #e2e8f0;
    text-decoration: none;
    transition: 0.3s;
}

a:hover {
    color: #7dd3fc;
}
</style>