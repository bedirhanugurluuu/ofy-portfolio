# Quick Deploy to Vercel Script
Write-Host "Quick Deploy to Vercel..." -ForegroundColor Green

# 1. Switch to Vercel environment
Write-Host "Step 1: Switching to Vercel environment..." -ForegroundColor Yellow
& .\switch-to-vercel.ps1

# 2. Git operations
Write-Host "Step 2: Git operations..." -ForegroundColor Yellow
git add .
git commit -m "Deploy to Vercel - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push

Write-Host "Quick deploy completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Vercel Dashboard ana proje deploy kontrol" -ForegroundColor White
Write-Host "   2. Admin panel deploy kontrol" -ForegroundColor White
Write-Host "   3. Environment variables kontrol" -ForegroundColor White
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "   - Ana proje: https://ofy-portfolio-h97t.vercel.app" -ForegroundColor White
Write-Host "   - Admin panel: https://ofy-admin-panel-dqfqs0s7l-bedirhanugurluuus-projects.vercel.app/admin" -ForegroundColor White
