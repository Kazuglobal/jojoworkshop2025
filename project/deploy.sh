#!/bin/bash

# Voice Atelier Deployment Script
echo "🎼 Voice Atelier - Deployment Script"
echo "=================================="

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_dependencies() {
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    
    if ! command -v supabase &> /dev/null; then
        echo -e "${YELLOW}⚠️  Supabase CLI not found. Installing...${NC}"
        npm install -g supabase
    fi
    
    echo -e "${GREEN}✅ Dependencies checked${NC}"
}

# Build the project
build_project() {
    echo -e "${YELLOW}Building project...${NC}"
    
    npm install
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build successful${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
}

# Deploy to Supabase
deploy_supabase() {
    echo -e "${YELLOW}Deploying to Supabase...${NC}"
    
    # Check if user is logged in
    if ! supabase status &> /dev/null; then
        echo -e "${YELLOW}Please login to Supabase first:${NC}"
        supabase login
    fi
    
    # Link project if not already linked
    if [ ! -f ".supabase/config.toml" ]; then
        echo -e "${YELLOW}Linking Supabase project...${NC}"
        supabase link --project-ref dgclcoaxalatwvyjeeld
    fi
    
    # Deploy Edge Functions
    echo -e "${YELLOW}Deploying Edge Functions...${NC}"
    supabase functions deploy send-admin-notification
    supabase functions deploy send-thank-you-email
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Supabase deployment successful${NC}"
    else
        echo -e "${RED}❌ Supabase deployment failed${NC}"
        exit 1
    fi
}

# Deploy to Vercel (optional)
deploy_vercel() {
    echo -e "${YELLOW}Deploying to Vercel...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Vercel deployment successful${NC}"
    else
        echo -e "${RED}❌ Vercel deployment failed${NC}"
        exit 1
    fi
}

# Setup database
setup_database() {
    echo -e "${YELLOW}Setting up database...${NC}"
    
    if [ -f "supabase-setup.sql" ]; then
        echo -e "${YELLOW}Please run the SQL in supabase-setup.sql in your Supabase dashboard${NC}"
        echo -e "${YELLOW}SQL Editor: https://supabase.com/dashboard/project/dgclcoaxalatwvyjeeld/sql${NC}"
    else
        echo -e "${RED}❌ supabase-setup.sql not found${NC}"
        exit 1
    fi
}

# Main deployment function
main() {
    echo -e "${GREEN}Starting deployment process...${NC}"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --skip-supabase)
                SKIP_SUPABASE=true
                shift
                ;;
            --skip-vercel)
                SKIP_VERCEL=true
                shift
                ;;
            --setup-db)
                SETUP_DB=true
                shift
                ;;
            -h|--help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-build      Skip the build process"
                echo "  --skip-supabase   Skip Supabase deployment"
                echo "  --skip-vercel     Skip Vercel deployment"
                echo "  --setup-db        Setup database (shows SQL instructions)"
                echo "  -h, --help        Show this help message"
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                exit 1
                ;;
        esac
    done
    
    check_dependencies
    
    if [ "$SETUP_DB" = true ]; then
        setup_database
        exit 0
    fi
    
    if [ "$SKIP_BUILD" != true ]; then
        build_project
    fi
    
    if [ "$SKIP_SUPABASE" != true ]; then
        deploy_supabase
    fi
    
    if [ "$SKIP_VERCEL" != true ]; then
        echo -e "${YELLOW}Deploy to Vercel? (y/n)${NC}"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            deploy_vercel
        fi
    fi
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}🔗 Don't forget to:${NC}"
    echo -e "${YELLOW}   1. Set up Resend API key in Supabase dashboard${NC}"
    echo -e "${YELLOW}   2. Run database setup SQL if not done yet${NC}"
    echo -e "${YELLOW}   3. Test the form submission${NC}"
    echo -e "${GREEN}📧 Admin email: globalbunny77@gmail.com${NC}"
}

# Run the main function
main "$@"