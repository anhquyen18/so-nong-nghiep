<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#1ac144',
        sizeStep: 4,
        sizeUnit: 2,
        borderRadius: 8,
        wireframe: false,
        colorTextBase: '#424343',
      },
    }">
    <router-view></router-view>
  </a-config-provider>
</template>
