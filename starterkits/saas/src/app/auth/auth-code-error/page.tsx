import Link from 'next/link'
import { siteUrls } from '@/config/urls'
import { Button } from '@/components/ui/button'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="mt-2 text-gray-600">
          Sorry, we couldn't log you in. The authentication link may have expired or been used already.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href={siteUrls.auth.login}>
              Try Again
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
