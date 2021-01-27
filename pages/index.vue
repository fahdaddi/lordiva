<template>
  <section>
    <svg-icon name="address_book" class="w-10 h-10" />
    <svg-icon name="warning" class="w-10 h-10" />
    <svg-icon name="user" class="w-10 h-10" />
    <o-field grouped group-multiline>
      <!-- <div class="control">
        <o-switch v-model="atRight"> Right position </o-switch>
      </div>
      <div class="control">
        <o-switch v-model="expanded"> Expanded </o-switch>
      </div> -->
      <o-field label="Size" label-for="size">
        <o-select id="size" v-model="size" placeholder="Size">
          <option :value="null">Default</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </o-select>
      </o-field>
      <o-field label="Type" label-for="type">
        <o-select id="type" v-model="type" placeholder="Type">
          <option :value="null">Default</option>
          <option value="boxed">Boxed</option>
          <option value="toggle">Toggle</option>
        </o-select>
      </o-field>
    </o-field>

    <o-tabs
      :position="atRight ? 'right' : ''"
      :size="size"
      :type="type"
      :expanded="expanded"
    >
      <o-tab-item label="Pictures" icon="images">
        {{ $t('accept_cookies') }}
      </o-tab-item>

      <o-tab-item label="Music" icon="music">
        What light is light, if Silvia be not seen? <br />
        What joy is joy, if Silvia be not by— <br />
        Unless it be to think that she is by <br />
        And feed upon the shadow of perfection? <br />
        Except I be by Silvia in the night, <br />
        There is no music in the nightingale.
      </o-tab-item>

      <o-tab-item label="Videos" icon="video">
        Nunc nec velit nec libero vestibulum eleifend. Curabitur pulvinar congue
        luctus. Nullam hendrerit iaculis augue vitae ornare. Maecenas vehicula
        pulvinar tellus, id sodales felis lobortis eget.
      </o-tab-item>
    </o-tabs>
  </section>
</template>

<script>
export default {
  data() {
    return {
      expanded: false,
      atRight: false,
      size: null,
      type: null,
    }
  },
}
</script>
