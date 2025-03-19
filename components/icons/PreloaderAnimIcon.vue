<template>
  <svg
    class="animate-spin"
    width="112"
    height="112"
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#paint0_angular_576_3408_clip_path)" data-figma-skip-parse="true">
      <g transform="matrix(0.09 0 0 0.09 90 90)">
        <foreignObject x="-1083.33" y="-1083.33" width="2166.67" height="2166.67">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            v-if="props.theme == 'white'"
            style="
              background: conic-gradient(
                from 90deg,
                rgba(255, 255, 255, 0) 0deg,
                rgba(255, 255, 255, 0) 0.036deg,
                rgba(255, 255, 255, 1) 360deg
              );
              height: 100%;
              width: 100%;
              opacity: 1;
            "
          ></div>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            v-if="props.theme == 'black'"
            style="
              background: conic-gradient(
                from 90deg,
                rgba(0, 0, 0, 0) 0deg,
                rgba(0, 0, 0, 0) 0.036deg,
                rgba(0, 0, 0, 1) 360deg
              );
              height: 100%;
              width: 100%;
              opacity: 1;
            "
          ></div>
        </foreignObject>
      </g>
    </g>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180ZM90 165C131.421 165 165 131.421 165 90C165 48.5786 131.421 15 90 15C48.5786 15 15 48.5786 15 90C15 131.421 48.5786 165 90 165Z"
      data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:0.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:0.0},&#34;position&#34;:9.9999997473787516e-05},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:0.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:0.0},&#34;position&#34;:9.9999997473787516e-05},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:180.0,&#34;m01&#34;:1.7089393864865715e-13,&#34;m02&#34;:-1.5987211554602254e-13,&#34;m10&#34;:-9.0957874099382302e-14,&#34;m11&#34;:180.0,&#34;m12&#34;:-3.9968028886505635e-14},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M170.86 72C174.968 71.47 178.728 74.3706 179.258 78.4787C179.75 82.2976 179.997 86.1442 179.997 89.9948C179.997 94.1369 176.639 97.4948 172.497 97.4948C168.355 97.4948 164.997 94.1369 164.997 89.9948C164.997 86.7859 164.791 83.5804 164.381 80.398C163.851 76.2899 166.751 72.53 170.86 72Z"
      :fill="props.theme"
    />
    <defs>
      <clipPath id="paint0_angular_576_3408_clip_path">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180ZM90 165C131.421 165 165 131.421 165 90C165 48.5786 131.421 15 90 15C48.5786 15 15 48.5786 15 90C15 131.421 48.5786 165 90 165Z"
        />
      </clipPath>
    </defs>
  </svg>
</template>
<script setup lang="ts">
const props = defineProps({
  theme: {
    type: String,
    default: 'white',
    validator: (value: string) => ['black', 'white'].includes(value),
  },
});
</script>
