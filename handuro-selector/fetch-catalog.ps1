$ErrorActionPreference='Stop'
$base=Join-Path $PSScriptRoot 'sources'
New-Item -ItemType Directory -Force -Path $base | Out-Null
$html=Get-Content (Join-Path $PSScriptRoot 'catalog-source.html') -Raw
$links=[regex]::Matches($html,'href="([^"]+info_\d+\.html)"') | ForEach-Object {$_.Groups[1].Value} | Sort-Object -Unique
$records=@()
foreach($link in $links){
 $id=[regex]::Match($link,'info_(\d+)').Groups[1].Value
 $page=Invoke-WebRequest -UseBasicParsing -Uri ('https://www.handuro.com'+$link)
 $page.Content | Set-Content (Join-Path $base ($id+'.html')) -Encoding utf8
 $images=[regex]::Matches($page.Content,'(?:src|href)="(/uploadfile/[^"<>]+)"') | ForEach-Object {$_.Groups[1].Value} | Sort-Object -Unique
 $files=@()
 foreach($img in $images){
  if($img -notmatch '/cp/'){continue}
  $name=$id+'-'+[IO.Path]::GetFileName($img)
  Invoke-WebRequest -UseBasicParsing -Uri ('https://www.handuro.com'+$img) -OutFile (Join-Path $base $name)
  $files+=@{url='https://www.handuro.com'+$img;file='sources/'+$name}
 }
 $records+=@{id=$id;url='https://www.handuro.com'+$link;images=$files}
 Write-Output "Ficha $id : $($files.Count) imágenes"
}
$records | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $base 'manifest.json') -Encoding utf8

