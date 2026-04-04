import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { logEvent } from 'src/services/analytics/index.js'
import { Spinner } from '../components/Spinner.js'
import { getOauthConfig } from '../constants/oauth.js'
import { useTimeout } from '../hooks/useTimeout.js'
import { Box, Text } from '../ink.js'
import { getSSLErrorHint } from '../services/api/errorUtils.js'
import { logForDebugging } from './debug.js'
import { isEnvTruthy } from './envUtils.js'
import { getUserAgent } from './http.js'
import { logError } from './log.js'

export interface PreflightCheckResult {
  success: boolean
  error?: string
  sslHint?: string
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '')
}

/** Skip TCP preflight (e.g. self-hosted gateway without /api/hello, or offline dev). */
function isConnectivityPreflightSkipped(): boolean {
  return (
    isEnvTruthy(process.env.CLAUDE_CODE_SKIP_CONNECTIVITY_PREFLIGHT) ||
    isEnvTruthy(process.env.ERGOU_SKIP_PREFLIGHT)
  )
}

async function checkEndpoints(): Promise<PreflightCheckResult> {
  try {
    if (isConnectivityPreflightSkipped()) {
      logForDebugging(
        '[preflight] skipped (CLAUDE_CODE_SKIP_CONNECTIVITY_PREFLIGHT or ERGOU_SKIP_PREFLIGHT)',
      )
      return { success: true }
    }

    const oauthConfig = getOauthConfig()
    const tokenUrl = new URL(oauthConfig.TOKEN_URL)
    const customBase = process.env.ANTHROPIC_BASE_URL?.trim()

    let endpoints: string[]
    if (customBase) {
      const base = trimTrailingSlash(customBase)
      endpoints = [`${base}/api/hello`]
      logForDebugging(`[preflight] ANTHROPIC_BASE_URL set — checking ${endpoints[0]}`)
    } else {
      endpoints = [
        `${oauthConfig.BASE_API_URL}/api/hello`,
        `${tokenUrl.origin}/v1/oauth/hello`,
      ]
    }

    const checkEndpoint = async (url: string): Promise<PreflightCheckResult> => {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': getUserAgent(),
          },
        })
        if (response.status !== 200) {
          const hostname = new URL(url).hostname
          return {
            success: false,
            error: `Failed to connect to ${hostname}: Status ${response.status}`,
          }
        }
        return { success: true }
      } catch (error) {
        const hostname = new URL(url).hostname
        const sslHint = getSSLErrorHint(error)
        return {
          success: false,
          error: `Failed to connect to ${hostname}: ${error instanceof Error ? (error as NodeJS.ErrnoException).code || error.message : String(error)}`,
          sslHint: sslHint ?? undefined,
        }
      }
    }

    const results = await Promise.all(endpoints.map(checkEndpoint))
    const failedResult = results.find(result => !result.success)
    if (failedResult) {
      logEvent('tengu_preflight_check_failed', {
        isConnectivityError: false,
        hasErrorMessage: !!failedResult.error,
        isSSLError: !!failedResult.sslHint,
      })
    }
    return failedResult || { success: true }
  } catch (error) {
    logError(error as Error)
    logEvent('tengu_preflight_check_failed', {
      isConnectivityError: true,
    })
    return {
      success: false,
      error: `Connectivity check error: ${error instanceof Error ? (error as NodeJS.ErrnoException).code || error.message : String(error)}`,
    }
  }
}

interface PreflightStepProps {
  onSuccess: () => void
}

export function PreflightStep({ onSuccess }: PreflightStepProps): React.ReactNode {
  const [result, setResult] = useState<PreflightCheckResult | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const showSpinner = useTimeout(1000) && isChecking

  useEffect(() => {
    void (async () => {
      const checkResult = await checkEndpoints()
      setResult(checkResult)
      setIsChecking(false)
    })()
  }, [])

  useEffect(() => {
    if (result?.success) {
      onSuccess()
    } else if (result && !result.success) {
      const timer = setTimeout(() => process.exit(1), 100)
      return () => clearTimeout(timer)
    }
  }, [result, onSuccess])

  return (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      {isChecking && showSpinner ? (
        <Box paddingLeft={1}>
          <Spinner />
          <Text>Checking connectivity...</Text>
        </Box>
      ) : !result?.success && !isChecking ? (
        <Box flexDirection="column" gap={1}>
          <Text color="error">Unable to connect to Anthropic services</Text>
          <Text color="error">{result?.error}</Text>
          {result?.sslHint ? (
            <Box flexDirection="column" gap={1}>
              <Text>{result.sslHint}</Text>
              <Text color="suggestion">
                See https://code.claude.com/docs/en/network-config
              </Text>
            </Box>
          ) : (
            <Box flexDirection="column" gap={1}>
              <Text>
                Please check your internet connection and network settings.
              </Text>
              <Text>
                Note: Claude Code might not be available in your country. Check supported countries at{' '}
                <Text color="suggestion">https://anthropic.com/supported-countries</Text>
              </Text>
              {process.env.ANTHROPIC_BASE_URL ? (
                <Text dimColor>
                  Custom ANTHROPIC_BASE_URL is set — preflight checks that host&apos;s /api/hello. If your
                  gateway has no /api/hello, set CLAUDE_CODE_SKIP_CONNECTIVITY_PREFLIGHT=1 or
                  ERGOU_SKIP_PREFLIGHT=1.
                </Text>
              ) : null}
            </Box>
          )}
        </Box>
      ) : null}
    </Box>
  )
}
