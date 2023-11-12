<!-- Report events from the slotted component -->

<template>
  <div class="events-demo">
    <ssr-carousel
      show-arrows
      show-dots
      @change="logEvent('change', $event)"
      @press="logEvent('press', $event)"
      @release="logEvent('release', $event)"
      @drag:start="logEvent('drag:start', $event)"
      @drag:input="logEvent('drag:input', $event)"
      @drag:end="logEvent('drag:end', $event)"
      @tween:start="logEvent('tween:start', $event)"
      @tween:end="logEvent('tween:end', $event)"
    >
      <slide v-for="i in 3" :index="i" :key="i" />
    </ssr-carousel>

    <pre class="events" v-if="events.length">
      <code class="event" v-for="event in events">
        <span class="name">
          <strong>Event:</strong> "{{ event.name }}"
        </span>
        <span class="payload" v-if="event.payload">
          <strong>Payload:</strong> {{ JSON.stringify(event.payload) }}
        </span>
      </code>
    </pre>
  </div>
</template>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<script>
import Slide from '~/components/slide.vue';

export default {
  components: {
    Slide
  },
  data() {
    return {
      events: []
    };
  },
  // Push events onto the stack
  methods: {
    logEvent(name, payload) {
      return this.events.unshift({ name, payload });
    }
  }
};
</script>

<!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

<style lang="scss" scoped>
.events {
  padding: 1em;
}

.event {
  display: block;

  :deep(strong) {
    opacity: 0.5;
  }
}

.name {
  margin-right: 0.5em;
}
</style>
