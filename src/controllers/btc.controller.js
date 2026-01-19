function normalizeBtcAddress(raw) {
  const address = String(raw || '').trim()
  return address
}

function looksLikeBtcAddress(address) {
  if (!address) return false
  if (address.length < 14 || address.length > 120) return false
  return address.startsWith('1') || address.startsWith('3') || address.toLowerCase().startsWith('bc1')
}

export async function getBtcBalance(req, res) {
  const address = normalizeBtcAddress(req.params.address)
  if (!looksLikeBtcAddress(address)) {
    return res.status(400).json({ error: 'Invalid bitcoin address' })
  }

  try {
    const url = `https://blockstream.info/api/address/${encodeURIComponent(address)}`
    const resp = await fetch(url, {
      headers: {
        accept: 'application/json',
      },
    })

    if (!resp.ok) {
      return res.status(502).json({ error: 'Failed to fetch bitcoin balance' })
    }

    const data = await resp.json()
    const funded = Number(data?.chain_stats?.funded_txo_sum ?? 0)
    const spent = Number(data?.chain_stats?.spent_txo_sum ?? 0)
    const fundedMempool = Number(data?.mempool_stats?.funded_txo_sum ?? 0)
    const spentMempool = Number(data?.mempool_stats?.spent_txo_sum ?? 0)

    const confirmedSats = funded - spent
    const mempoolDeltaSats = fundedMempool - spentMempool
    const totalSats = confirmedSats + mempoolDeltaSats

    return res.json({
      address,
      confirmedSats,
      mempoolDeltaSats,
      totalSats,
      confirmedBtc: confirmedSats / 1e8,
      totalBtc: totalSats / 1e8,
    })
  } catch (err) {
    console.error(err)
    return res.status(502).json({ error: 'Failed to fetch bitcoin balance' })
  }
}
