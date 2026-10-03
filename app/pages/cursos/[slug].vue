<!--
  Página de curso: a lousa com título e compra (ou a lista de espera); a ementa logo depois, ao lado
  da aula grátis; e o resto do conteúdo embaixo.
-->
<script setup lang="ts">
import { getCourseDetail, getFreeLesson } from '#shared/content/course-details'
import { getCourse } from '#shared/content/courses'

const route = useRoute()
const slug = String(route.params.slug)
const course = getCourse(slug)
const detail = getCourseDetail(slug)
// Só os cursos conhecidos existem; qualquer outro slug vira 404. The port shows the regular 404 page here,
// where the reference app doubles the header and footer (#21).
if (!course || !detail) throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })

useSeoMeta({ title: course.title, description: course.summary })

const freeLessonId = 'aula-gratis'
const onSaleDetail = detail.kind === 'on-sale' ? detail : undefined
const freeLesson = onSaleDetail && getFreeLesson(onSaleDetail)
const freeLessonHref = freeLesson && `#${freeLessonId}`
const buyHref = `/cursos/${slug}/comprar`

const { data: enrollment } = await useFetch(`/api/courses/${slug}/enrollment`, { key: `enrollment-${slug}` })
const owned = computed(() => Boolean(enrollment.value?.owned))
</script>

<template>
  <div>
    <!-- A barra de compra do celular é `sticky` dentro deste bloco: acompanha a página e para antes do rodapé. -->
    <div :class="cn(container, 'pb-24 pt-6 sm:pb-32 sm:pt-10 lg:pb-40')">
      <BackToCourses />
      <div class="mt-3">
        <CourseBoard :course="course">
          <OwnedCourse
            v-if="owned"
            :course-slug="slug"
          />
          <PriceAndBuy
            v-else-if="onSaleDetail"
            :pricing="onSaleDetail.pricing"
            :buy-href="buyHref"
            :free-lesson-href="freeLessonHref"
          />
          <!-- The waitlist form (one click when signed in, the email otherwise) comes with its own ticket (#8). -->
        </CourseBoard>
      </div>

      <div class="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div class="lg:col-span-7">
          <SyllabusSection
            v-if="onSaleDetail"
            :modules="onSaleDetail.modules"
            :free-lesson-href="freeLessonHref"
          />
          <CoverageSection
            v-else-if="detail.kind === 'waitlist'"
            :items="detail.coverage"
          />
        </div>
        <div class="lg:col-span-5">
          <FreeLessonSection
            v-if="freeLesson"
            :id="freeLessonId"
            :lesson="freeLesson.lesson"
            :number="freeLesson.number"
            :module-title="freeLesson.module.title"
          />
        </div>
      </div>

      <div class="lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div class="lg:col-span-7">
          <WhySection :paragraphs="detail.why" />
          <LearnSection :items="detail.learn" />
          <AudienceSection :items="detail.audience" />
          <CourseFaqSection :items="detail.faq" />
        </div>
      </div>
    </div>

    <MobileBuyBar
      v-if="onSaleDetail && !owned"
      :watch-id="boardBuyId"
      :buy-href="buyHref"
      :price="brl(onSaleDetail.pricing.price)"
      :installments="priceTerms(onSaleDetail.pricing).installments"
    />
  </div>
</template>
