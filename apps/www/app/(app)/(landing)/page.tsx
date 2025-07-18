import { Features } from '@/app/(app)/(landing)/_components/features'
import { Hero } from '@/app/(app)/(landing)/_components/hero'
import { Demos } from '@/app/(app)/(landing)/_components/demos'
import { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { CallToAction } from '@/app/(app)/(landing)/_components/cta'
import { Benefits } from '@/app/(app)/(landing)/_components/benefits'
import { PageContainer } from '@/app/(app)/_components/page-header'

export const metadata: Metadata = {
    title: `${siteConfig.name} | Open Source Starter Kits & UI Components`,
    description:
        'Build and launch your SaaS MVP faster with our open-source starter kits, reusable components, and expert developer services. Get started today!',
}

export default function MarketingPage() {
    return (
        <PageContainer>
            <section className="flex w-full flex-col gap-16">
                <Hero />

                <Demos />
            </section>

            <Features />

            <Benefits />

            <CallToAction />
        </PageContainer>
    )
}
