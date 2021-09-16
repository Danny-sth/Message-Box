function getIndex(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
}

var messageApi = Vue.resource('/messages{/id}')

Vue.component('messageForm', {
    props: ['messages', 'messageAttribute'],
    data: function () {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        messageAttribute: function (newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },

    template: '<div>' +
        '<input type="text" placeholder="Write Something" v-model="text" />' +
        '<input type="button" value="Save" @click="save"/>' +
        '</div>',
    methods: {
        save: function () {
            var message = {text: this.text};

            if (this.id) {
                messageApi.update({id: this.id}, message).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.messages, data.id)
                        this.messages.splice(index, 1, data);
                        this.text = ''
                        this.id = ''
                    })
                )
            } else {
                messageApi.save({}, message).then(result =>
                    result.json().then(data => {
                        this.messages.push(data);
                        this.text = '';
                    }))
            }
        }
    }
});

Vue.component('messageRow', {
    props: ['message', 'editMethod', 'messages'],
    template: '<div>' +
        '<i>({{ message.id }})</i> {{ message.text }}' +
        '<span style="position: absolute; right: 0">' +
        '<input type="button" value="Edit" @click="edit" />' +
        '<input type="button" value="X" @click="del" />' +
        '</span>' +
        '</div>',
    methods: {
        edit: function () {
            this.editMethod(this.message);
        },
        del: function () {
            messageApi.remove({id: this.message.id}).then(result => {
                if (result.ok) {
                    this.messages.splice(this.messages.indexOf(this.message), 1)
                }
            })
        }
    }
});
Vue.component('messageList', {
    props: ['messages'],
    data: function () {
        return {
            message: null
        }
    },
    template: '<div style="position: relative; width: 300px;">' +
        '<messageForm :messages="messages" :messageAttribute="message"/>' +
        '<messageRow v-for="message in messages" :key="message.id" :message="message"' +
        ':editMethod="editMethod" :messages="messages" />' +
        '</div>',
    created: function () {
        messageApi.get().then(result =>
            result.json().then(data =>
                data.forEach(message => this.messages.push(message))
            )
        )
    },
    methods: {
        editMethod: function (message) {
            this.message = message;
        }
    }
});

var app = new Vue({
    el: '#app',
    template: '<messageList :messages="messages"/>',
    data: {
        messages: []
    }
})
