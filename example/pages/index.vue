<template>
  <div>
    <select multiple v-model="flags">
      <option
        v-for="item in countries"
        :key="item.alpha2Code"
        :value="{
          flag: item.flag,
          name: item.name
        }"
      >
        {{ item.name }}
      </option>
    </select>

    <ul>
      <li v-for="(item, index) in flags" :key="index">
        <img :src="item.flag" :alt="item.name" height="50" />
      </li>
    </ul>
  </div>
</template>

<script>
import countries from '~/static/data/countries.json'

export default {
  data() {
    return {
      flags: [],
      countries
    }
  }
}
</script>

<style>
select {
  margin-bottom: 20px;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

ul li {
  display: inline-block;
}

ul li:not(:last-child) {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
