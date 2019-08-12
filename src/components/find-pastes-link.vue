<template>
  <div class="find-pastes">
        <router-link to="/find">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </router-link>
      </div>
</template>

<style scoped>
.find-pastes {
  padding: 0.5em;
  padding-top: 1em;
  transform: rotateY(15deg);
  background: rgba(33,0,10,0.1);
  border-radius: 10px;
  transform: translateY(-10px);
}
.find-pastes svg {
  width: 1.3rem;
  color: rgba(150,150,150,1);
  transition: color 0.25s;
}
.find-pastes svg:hover {
  color: rgba(100,100,100,1)
}
</style>