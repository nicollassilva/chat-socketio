<template>
    <div>
        <div class="peoples">
            <transition-group name="fade">
            <div class="people" v-for="group in groups" :key="group.id">
                {{ group.name }}
            </div>
            </transition-group>
        </div>
    </div>
</template>
<script>
export default {
    name: "Groups",
    props: { groups: Array }
}
</script>