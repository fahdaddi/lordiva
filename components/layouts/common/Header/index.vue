<template>
  <header>
    <div class="container">
      <span key="menu" class="menu">
        <c-svg class="sm">menu</c-svg>
        <span>{{ $t('menu') }}</span>
      </span>
      <c-img
        class="logo"
        :src="{ path: '/img/', filename: 'logo.png' }"
        :lazy="false"
        :alt="$t('logo') + ' ' + $config('site')"
        type="logo"
        size="main"
        @click="pushUrl(`/`)"
      />
      <!-- :size="$device.isMobile ? 'mobile' : 'main'" -->

      <div class="right">
        <c-svg class="sm">search</c-svg>
        <c-svg class="sm">user</c-svg>
        <c-svg class="sm">cart</c-svg>
      </div>
    </div>
  </header>
</template>

<script>
export default {}
</script>