#!/bin/bash
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/sithu/.local/share/solana/install/active_release/bin"

EMPLOYER="D3u8qWpun6GePtuCWZuzaotCaJ2NaBhfp5Pr7HS6KfaR"
EMP1="E2XLgmiFot8pB9WD3tyVJRVXrTW6HwmDH5fhxEvKeEmd"
EMP2="BfvNA5ryyaxL7xcJmYbq7Z1QXFQRcAf3SVAHnd1Bmmge"
EMP3="FUkEsEJCy5CG7FkcbkYHEvate84cLgmDpikagBVFKuHo"

echo "==> Airdropping via RPC..."
for ADDR in $EMPLOYER $EMP1 $EMP2 $EMP3; do
  echo "Airdrop to $ADDR..."
  for i in 1 2 3 4 5; do
    RESULT=$(curl -s -X POST https://api.devnet.solana.com \
      -H "Content-Type: application/json" \
      -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"requestAirdrop\",\"params\":[\"$ADDR\",1000000000]}")
    echo "  Attempt $i: $RESULT"
    if echo "$RESULT" | grep -q '"result"'; then
      echo "  Success!"
      break
    fi
    sleep 10
  done
  sleep 5
done

echo ""
echo "==> Checking employer balance..."
solana balance $EMPLOYER --url https://api.devnet.solana.com

echo ""
echo "==> Creating SPL token mint..."
spl-token create-token --decimals 6 --keypair ./keys/employer.json --url https://api.devnet.solana.com 2>&1
