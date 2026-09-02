export interface AgentRuntimeBridge {
  searchCreators: (params: Record<string, unknown>) => Promise<unknown>
  crawlComments: (params: Record<string, unknown>) => Promise<unknown>
  getCreatorProfile: (params: Record<string, unknown>) => Promise<unknown>
  checkOutreachStatus: (params: Record<string, unknown>) => Promise<unknown>
  analyzePage: (params: Record<string, unknown>) => Promise<unknown>
  sendDm: (params: Record<string, unknown>) => Promise<unknown>
}

export type AutomaticAgentToolName = 'search_creators'
  | 'crawl_comments'
  | 'get_creator_profile'
  | 'check_outreach_status'
  | 'analyze_page'
