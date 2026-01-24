<template>
  <div class="min-h-screen bg-swiss-bg py-24">
    <!-- Page Header -->
    <section class="mb-16">
      <GridContainer>
        <div class="col-span-12 text-center">
          <TypographyHeader level="1" size="h1" class="mb-4">
            {{ $t('nav.about') }}
          </TypographyHeader>
          <p class="text-swiss-secondary max-w-2xl mx-auto">
            專注於為香港及海外市場提供高品質基礎設施解決方案
          </p>
        </div>
      </GridContainer>
    </section>

    <!-- Company Overview -->
    <section class="mb-24">
      <GridContainer>
        <div class="col-span-12 lg:col-span-6 mb-8 lg:mb-0">
          <TypographyHeader level="2" size="h2" class="mb-6">
            關於我們
          </TypographyHeader>
          <div class="space-y-4 text-swiss-secondary">
            <p>
              Project NEXUS 是一家專注於企業級基礎設施解決方案的提供商，致力於為香港及海外市場的客戶提供高品質的伺服器、存儲、網絡及相關服務。
            </p>
            <p>
              我們擁有超過 10 年的行業經驗，團隊由資深工程師和技術專家組成，累積服務超過 500 家企業客戶。
            </p>
            <p>
              我們的使命是通過先進的技術和專業的服務，幫助客戶構建安全、可靠、高效的信息技術基礎設施。
            </p>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="bg-white rounded-lg p-8 shadow-sm">
            <TypographyHeader level="3" size="h4" class="mb-6">
              關鍵數據
            </TypographyHeader>
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="text-4xl font-bold text-swiss-accent mb-2">10+</div>
                <div class="text-sm text-swiss-secondary">年行業經驗</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-swiss-accent mb-2">500+</div>
                <div class="text-sm text-swiss-secondary">企業客戶</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-swiss-accent mb-2">99.9%</div>
                <div class="text-sm text-swiss-secondary">服務可用性</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-swiss-accent mb-2">24/7</div>
                <div class="text-sm text-swiss-secondary">技術支援</div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Timeline -->
    <section class="mb-24">
      <GridContainer>
        <div class="col-span-12 mb-12">
          <TypographyHeader level="2" size="h2" class="text-center">
            發展歷程
          </TypographyHeader>
        </div>

        <div class="col-span-12">
          <div class="relative">
            <!-- Timeline Line -->
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-swiss-secondary/20"></div>

            <!-- Timeline Items -->
            <div class="space-y-12">
              <div
                v-for="(milestone, index) in milestones"
                :key="index"
                class="relative pl-20"
              >
                <!-- Timeline Dot -->
                <div class="absolute left-6 w-5 h-5 bg-swiss-accent rounded-full border-4 border-white"></div>

                <!-- Year -->
                <div class="text-sm font-bold text-swiss-accent mb-2">
                  {{ milestone.year }}
                </div>

                <!-- Content -->
                <TypographyHeader level="3" size="h5" class="mb-2">
                  {{ milestone.title }}
                </TypographyHeader>
                <p class="text-swiss-secondary">
                  {{ milestone.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </section>

    <!-- Values -->
    <section>
      <GridContainer>
        <div class="col-span-12 mb-12">
          <TypographyHeader level="2" size="h2" class="text-center">
            核心價值
          </TypographyHeader>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-8 shadow-sm h-full">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h4" class="mb-3">
              品質優先
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              我們堅持使用最高品質的產品和材料，確保每一個解決方案都能達到金融級的可靠性和穩定性。
            </p>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-8 shadow-sm h-full">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h4" class="mb-3">
              客戶為本
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              我們深入了解每個客戶的獨特需求，提供量身定制的解決方案和專業的技術支援服務。
            </p>
          </div>
        </div>

        <div class="col-span-12 md:col-span-4 mb-8">
          <div class="bg-white rounded-lg p-8 shadow-sm h-full">
            <div class="w-12 h-12 bg-swiss-accent/10 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-swiss-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <TypographyHeader level="3" size="h4" class="mb-3">
              創新驅動
            </TypographyHeader>
            <p class="text-swiss-secondary text-sm">
              我們持續追蹤和採用最新的技術趨勢，為客戶提供領先業界的創新解決方案。
            </p>
          </div>
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
const milestones = [
  {
    year: '2014',
    title: '公司成立',
    description: '在香港成立，專注於企業級伺服器解決方案',
  },
  {
    year: '2016',
    title: '業務擴展',
    description: '擴展至存儲和網絡解決方案，服務客戶超過 100 家',
  },
  {
    year: '2018',
    title: '區域發展',
    description: '開始服務海外市場，建立跨境運維團隊',
  },
  {
    year: '2020',
    title: '數字轉型',
    description: '推出雲端服務和 AI 運維解決方案',
  },
  {
    year: '2024',
    title: '持續創新',
    description: '累積服務超過 500 家企業，成為行業領先的基礎設施解決方案提供商',
  },
]

useHead({
  title: '關於我們 - Project NEXUS (HK)',
})
</script>
