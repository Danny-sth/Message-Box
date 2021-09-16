var messageApi = Vue.resource('/messages{/id}')

Vue.component('messageRow', {
    props: ['message'],
    template: '<div><i>({{ message.id }})</i> {{ message.text }}</div>'
});
Vue.component('messageList', {
    props: ['messages'],
    template: '<div><messageRow v-for="message in messages" :key="message.id" :message="message" /></div>',
    created: function () {
        messageApi.get().then(result =>
            result.json().then(data =>
                data.forEach(message => this.messages.push(message))
            )
        )
    }
});

var app = new Vue({
    el: '#app',
    template: '<messageList :messages="messages"/>',
    data: {
        messages: []
    }
})
