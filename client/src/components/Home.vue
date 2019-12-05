<template>
<div>
<div class="header">
<h1><span>R</span><span>e</span><span>s</span><span>e</span>
<span>r</span><span>v</span><span>a</span><span>t</span>
<span>i</span><span>o</span><span>n</span><div><span>f</span>
<span>o</span><span>r</span><span>m</span></div></h1>
</div>
<div id="booking" class="section">
    <v-form ref="form"
    v-model="reservation"
    @submit.prevent="addMessage" lazy-validation>
        <br>
        <div id="firstName">
            <v-row>
                <v-icon x-large>edit</v-icon>
                <v-col>
                    <v-text-field
                    v-model="message.name1"
                    :counter="30"
                    :rules="nameRules"
                    id="name1"
                    label="First name"
                    clearable
                    required >
                    </v-text-field>
                </v-col>
            </v-row>
        </div>

        <div id="lastName">
            <v-row>
                <v-icon x-large>edit</v-icon>
                <v-col>
                    <v-text-field
                    v-model="message.name2"
                    :counter="30"
                    :rules="nameRules"
                    label="Last name"
                    clearable
                    required ></v-text-field>
                </v-col>
            </v-row>
        </div>

        <div id="dataTime">
            <v-row>
                <v-icon x-large>event</v-icon>
                <v-col>
                    <v-dialog ref="dialog1"
                    v-model="modal1"
                    :return-value.sync="message.date1"
                    persistent width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field
                            v-model="message.date1"
                            label="Arrival date"
                            readonly v-on="on">
                            </v-text-field>
                        </template>
                        <v-date-picker
                        v-model="message.date1"
                        min="2019-12-03"
                        scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary"
                             @click="modal1 = false">Cancel</v-btn>
                            <v-btn text color="primary"
                            @click="$refs.dialog1.save(message.date1); checkReserv()">OK</v-btn>
                        </v-date-picker>
                    </v-dialog>
                </v-col>

                <v-icon x-large>event</v-icon>
                <v-col>
                    <v-dialog
                    ref="dialog2"
                     v-model="modal2"
                     :return-value.sync="message.date2" persistent width="310px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="message.date2"
                            label="Departure date" readonly
                            v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="message.date2"
                        min="2019-12-03"
                        scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary"
                             @click="modal2 = false">Cancel</v-btn>
                            <v-btn text color="primary"
                            @click="$refs.dialog2.save(message.date2); checkReserv()">OK</v-btn>
                        </v-date-picker>
                    </v-dialog>
                </v-col>
            </v-row>
        </div>


        <div id="numberPeople">
            <v-row justify="center">
                <v-icon x-large>people_alt</v-icon>
                <v-col>
                    <v-select v-model="message.select1" :items="numAdults"
                    :rules="[v => !!v || 'Item is required']"
                    label="Number of adults" required></v-select>
                </v-col>

                <v-icon x-large>face</v-icon>
                <v-col>
                    <v-select v-model="message.select2" :items="numChild"
                    :rules="[v => !!v || 'Item is required']"
                    label="Numder of child" required></v-select>
                </v-col>
            </v-row>
        </div>

        <div id="numberType">
            <v-row justify="center">
                <v-icon x-large>filter_8</v-icon>
                <v-col>
                    <v-select v-model="message.select3" :items="types"
                    :rules="[v => !!v || 'Item is required']"
                    label="Type of room" @input="checkReserv()" required></v-select>
                </v-col>
            </v-row>
        </div>

        <v-row justify="center">
            <v-checkbox v-model="checkbox"
            :rules="[v => !!v || 'You must agree to continue!']"
            label="I'm not a robot!" @change="checkReserv()" required></v-checkbox>
        </v-row>


        <v-row justify="center">
          <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="validate"
          type="submit"
          v-if="!getReservStatus() && checkbox"
          >
            Validate
          </v-btn>
          <div v-else-if="getReservStatus() === 1" align="center"><font color="red">Invalid dates  </font></div>
          <div v-else-if="getReservStatus() === 2" align="center"><font color="red">Room is already reserved on this time</font></div>
            <v-btn color="error" class="mr-4" @click="reset">
                Reset Form
            </v-btn>

            <v-btn color="warning" @click="resetValidation">
                Reset Validation
            </v-btn>
        </v-row>
        <br>
    </v-form>
</div>
</div>
</template>

<script>

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const API_URL = 'http://localhost:4000/messages';

var tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);
var reservStatus = 0;

export default {
  name: 'home',
  data: () => ({
    error: '',
    valid: true,
    modal1: false,
    modal2: false,
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 30) || 'Name must be less than 30 characters',
      v => (v && v.length >= 2) || 'Name must be greate than 2 characters',
      v => /^[A-Za-z]+$/.test(v) || 'Name can only contain Latin letters',
      v => /^[A-Z][a-z]+$/.test(v) || 'Only the first letter must be uppercase',
    ],
    messages: [],
    message: {
      name1: null,
      name2: null,
      date1: new Date().toISOString().substr(0, 10),
      date2: tomorrow.toISOString().substr(0, 10),
      select1: '1',
      select2: '0',
      select3: 'SNGL',
    },
    types: [
      'SNGL',
      'DBL',
      'TWN',
      'TRPL',
      'QDPL',
      'De luxe ',
      'Duplex',
      'Apartment',
    ],
    numAdults: [
      '1',
      '2',
      '3',
      '4',
    ],
    numChild: [
      '0',
      '1',
      '2',
      '3',
      '4',
    ],
    checkbox: false,
  }),
  computed: {
    reversedMessages() {
      return this.messages.slice().reverse();
    },
  },
  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then((result) => { this.messages = result; });
  },
  methods: {
      checkReserv() {
        reservStatus = 0;
        var dateFrom = new Date(this.message.date1.replace( /(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3"));
        var dateTo = new Date(this.message.date2.replace( /(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3"));
        if (dateFrom >= dateTo) {
          reservStatus = 1;
          return;
        }
        fetch(API_URL)
        .then(response => response.json())
        .then((result) => { this.messages = result; });
        for (var i = 0; i < this.messages.length; i++) {
        if (this.messages[i].select3 === this.message.select3) {
          var dateFromReserv = new Date(this.messages[i].date1.replace( /(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3"));
          var dateToReserv = new Date(this.messages[i].date2.replace( /(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3"));
          if ((dateFrom >= dateFromReserv && dateFrom < dateToReserv) || (dateTo > dateFromReserv && dateTo <= dateToReserv) || (dateFrom <= dateFromReserv && dateTo >= dateToReserv)) {
            reservStatus = 2;
          }
        }
      }
    },
    getReservStatus() {
		  return reservStatus;
	  },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    validate() {
      if (this.$refs.form.validate()) {
        if (!window.confirm('Are you sure?')) this.$refs.form.reset();
      }
    },
    addMessage() {
      console.log(this.message);
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.message),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then((result) => {
          if (result.details) {
            // there was an error...
            const error = result.details
              .map(detail => detail.message)
              .join('. ');
            this.error = error;
          } else {
            this.error = '';
            this.showMessageForm = false;
            this.messages.push(result);
          }
        });
    },
  },
};
</script>

<style>
.header {
    font-family: Verdana;
    font-size: 1.5em;
    font-weight: bold;
    color: #35FE02;
    letter-spacing: -0.11em;
    text-shadow: -0.2em 0px 0.2em #000000;
    text-align: center;
}

.header div {
    display: inline-block;
    color: #FE8F02;
}

h1 {
    padding: 10px;
}

body {
    background-image: url("../image/1.jpg");
    background-size: cover;
}
#booking {
    font-family: 'Montserrat', sans-serif;
    ;
    background-size: cover;
    background-position: center;
    width: 45%;
    margin: auto;
    border: 7px solid #90EE90;
    border-radius: 10px;
    background: #E0FFFF;
}

#firstName,
#lastName,
#dataTime,
#numberPeople {
    width: 90%;
    margin: auto;
}

#numberType {
    width: 45%;
    margin: auto;
}

</style>
