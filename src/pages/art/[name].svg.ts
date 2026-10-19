import type { APIRoute, GetStaticPaths } from 'astro';
import { artVariants, renderFlowArt, type ArtVariant } from '@/lib/flowart';

export const getStaticPaths: GetStaticPaths = () =>
  artVariants.flatMap((v) => [
    { params: { name: v }, props: { variant: v, hud: true } },
    { params: { name: `${v}-plain` }, props: { variant: v, hud: false } },
  ]);

export const GET: APIRoute = ({ props }) =>
  new Response(renderFlowArt(props.variant as ArtVariant, props.hud as boolean), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
